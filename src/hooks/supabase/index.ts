// Supabase hooks - centralized exports
export {
  useActivitiesSupabase,
  type Activity,
} from "@/hooks/supabase/useActivitiesSupabase";
export {
  useAlbumDetailSupabase,
  type AlbumDetail,
  type Song,
} from "@/hooks/supabase/useAlbumDetailSupabase";
export {
  useAlbumsSupabase,
  type Album,
} from "@/hooks/supabase/useAlbumsSupabase";
export { useCommentsSupabase } from "@/hooks/supabase/useCommentsSupabase";
export {
  onAuthStateChange,
  signInWithOAuth,
  signOut,
  useCurrentUserSupabase,
  type CurrentUser,
} from "@/hooks/supabase/useCurrentUserSupabase";
export {
  useSongSupabase,
  type SongDetail,
} from "@/hooks/supabase/useSongSupabase";
