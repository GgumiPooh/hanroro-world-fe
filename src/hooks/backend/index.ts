// Backend API hooks - centralized exports

export { useComments } from "@/hooks/backend/useComments";
export {
  useCurrentUser,
  type CurrentUser,
} from "@/hooks/backend/useCurrentUser";
export {
  useGalleries,
  type GalleryItem,
} from "@/hooks/backend/useGalleries";
export {
  useActivities,
  type Activity,
} from "@/hooks/backend/useActivities";
export {
  useAlbums,
  type Album,
} from "@/hooks/backend/useAlbums";
export {
  useAlbumDetail,
  type AlbumDetail,
  type Song,
} from "@/hooks/backend/useAlbumDetail";
export {
  useSong,
  type SongDetail,
} from "@/hooks/backend/useSong";
