import Button from "@/components/Button";
import { ENV_VARIABLE } from "@/utils/env-variable";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useRef, useState, type FC } from "react";

type Props = {
  onClose: () => void;
  onSuccess?: () => void;
};

const GalleryPostOverlay: FC<Props> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // 미리보기 URL 생성 (Base64)
    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (previews.length === 0) {
      alert("사진을 최소 1장 이상 추가해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const baseUrl = ENV_VARIABLE.API_BASE_URL || "http://localhost:8080";
      const res = await fetch(`${baseUrl}/api/public/gallery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: title.trim(),
          description: null,
          imageUrls: previews,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "게시물 등록에 실패했습니다.");
      }

      alert("게시물이 등록되었습니다!");
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
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative max-h-[90vh] scrollbar-pretty w-[min(95vw,600px)] overflow-y-auto rounded-3xl bg-gray-800 p-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
        >
          <XMarkIcon className="size-6" />
        </button>

        {/* 제목 */}
        <h2 className="mb-6 text-2xl font-bold text-plum-100">새 게시물</h2>

        {/* 사진 추가 영역 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-plum-300">
            사진 ({previews.length}장)
          </label>

          {/* 사진 미리보기 그리드 */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            {previews.map((preview, index) => (
              <div key={index} className="group relative aspect-3/4">
                <img
                  src={preview}
                  alt={`미리보기 ${index + 1}`}
                  className="size-full rounded-xl object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <XMarkIcon className="size-4" />
                </button>
              </div>
            ))}

            {/* 사진 추가 버튼 */}
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

        {/* 제목 입력 */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-plum-300">
            제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요..."
            className="w-full rounded-xl border border-gray-600 bg-gray-700/50 px-4 py-3 text-plum-100 placeholder-gray-500 transition-colors outline-none focus:border-plum-400"
          />
        </div>
        {/* 버튼 */}
        <div className="flex">
          <Button
            variant="ghost"
            size="md"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-plum-500 py-3 text-white hover:bg-plum-400 disabled:opacity-50"
          >
            {isSubmitting ? "게시 중..." : "게시하기"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GalleryPostOverlay;
