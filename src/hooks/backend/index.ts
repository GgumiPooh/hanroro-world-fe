// Backend API hooks - centralized exports
export { useActivities, type Activity } from "@/hooks/backend/useActivities";
export {
  useAlbumDetail,
  type AlbumDetail,
  type Song,
} from "@/hooks/backend/useAlbumDetail";
export { useAlbums, type Album } from "@/hooks/backend/useAlbums";
export { useComments } from "@/hooks/backend/useComments";
export {
  useCurrentUser,
  type CurrentUser,
} from "@/hooks/backend/useCurrentUser";
export { useSong, type SongDetail } from "@/hooks/backend/useSong";
