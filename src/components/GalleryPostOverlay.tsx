import Button from "@/components/Button";
import { ENV_VARIABLE } from "@/utils/env-variable";
import {
  ArrowUpTrayIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState, type FC } from "react";

// 빠른 이미지 압축 (Canvas 사용)
const compressImage = (file: File, maxSize = 1920, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    // 이미 작은 파일은 그대로 반환
    if (file.size < 500 * 1024) {
      resolve(file);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width, height } = img;

      // 리사이즈 계산
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height / width) * maxSize;
          width = maxSize;
        } else {
          width = (width / height) * maxSize;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        },
        "image/jpeg",
        quality,
      );
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
};

type FileItem = {
  originalFile: File;
  compressedFile: File | null; // 압축 완료되면 채워짐
  preview: string;
  isCompressing: boolean;
};

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

const GalleryPostOverlay: FC<Props> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 선택 시 바로 압축 시작
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newItems: FileItem[] = Array.from(selectedFiles).map((file) => ({
      originalFile: file,
      compressedFile: null,
      preview: URL.createObjectURL(file),
      isCompressing: true,
    }));

    const startIndex = files.length;
    setFiles((prev) => [...prev, ...newItems]);

    // 백그라운드에서 병렬 압축 (Canvas - 빠름!)
    newItems.forEach(async (item, i) => {
      const index = startIndex + i;
      const compressed = await compressImage(item.originalFile);
      console.log(
        `압축 완료: ${item.originalFile.name} (${(item.originalFile.size / 1024 / 1024).toFixed(1)}MB → ${(compressed.size / 1024 / 1024).toFixed(1)}MB)`,
      );
      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === index
            ? { ...f, compressedFile: compressed, isCompressing: false }
            : f,
        ),
      );
    });
  };

  const handleRemoveImage = (index: number) => {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 압축 중인 파일이 있는지 확인
  const isAnyCompressing = files.some((f) => f.isCompressing);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (files.length === 0) {
      alert("사진을 최소 1장 이상 추가해주세요.");
      return;
    }
    if (isAnyCompressing) {
      alert("이미지 압축 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setIsSubmitting(true);
    const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";

    try {
      // 이미 압축된 파일들로 업로드 (압축 대기 없음!)
      const uploadPromises = files.map(async ({ compressedFile, originalFile }) => {
        const file = compressedFile || originalFile;

        const prepareRes = await fetch(`${baseUrl}/api/uploads/prepare`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            filename: originalFile.name,
            mimeType: file.type,
          }),
        });

        if (!prepareRes.ok) throw new Error("presigned URL 발급 실패");
        const { objectKey, presignedUrl } = await prepareRes.json();

        const uploadRes = await fetch(presignedUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadRes.ok) throw new Error("R2 업로드 실패");

        const confirmRes = await fetch(`${baseUrl}/api/uploads/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ objectKey }),
        });

        if (!confirmRes.ok) throw new Error("업로드 확인 실패");
        const { url } = await confirmRes.json();
        return url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const res = await fetch(`${baseUrl}/api/public/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: null,
          imageUrls: uploadedUrls,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "게시물 등록에 실패했습니다.");
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to create gallery:", err);
      alert(err instanceof Error ? err.message : "게시물 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center backdrop-blur-lg">
      <div className="scrollbar-pretty relative max-h-[90vh] w-[min(95vw,600px)] overflow-y-auto rounded-3xl border border-gray-500/60 bg-black p-6">
        <Button
          onClick={onClose}
          variant="icon"
          size="sm"
          className="absolute top-4 right-4"
        >
          <XMarkIcon className="size-6 text-gray-400" />
        </Button>

        <h2 className="mb-6 text-2xl font-bold text-plum-100">새 게시물</h2>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-plum-300">
            사진 ({files.length}장)
            {isAnyCompressing && (
              <span className="ml-2 text-yellow-400">압축 중...</span>
            )}
          </label>

          <div className="mb-4 grid grid-cols-3 gap-3">
            {files.map(({ preview, isCompressing }, index) => (
              <div key={index} className="group relative aspect-3/4">
                <img
                  src={preview}
                  alt={`미리보기 ${index + 1}`}
                  className="size-full rounded-xl object-cover"
                />
                {/* 압축 중 표시 */}
                {isCompressing && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                    <div className="size-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <XMarkIcon className="size-4" />
                </button>
              </div>
            ))}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-3/4 items-center justify-center rounded-xl border-2 border-dashed border-gray-600 text-gray-500 transition-colors hover:border-plum-400 hover:text-plum-400"
            >
              <PhotoIcon className="size-10" />
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-[#faf8e1]">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요..."
            className="w-full rounded-xl border border-gray-600 bg-gray-700/50 px-4 py-3 text-plum-100 placeholder-gray-500 outline-none transition-colors focus:border-plum-400"
          />
        </div>

        <div className="flex">
          <Button
            variant="icon"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting || isAnyCompressing}
            className="flex-1 rounded-xl text-[#fffac3] py-3 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <ArrowUpTrayIcon className="size-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPostOverlay;
