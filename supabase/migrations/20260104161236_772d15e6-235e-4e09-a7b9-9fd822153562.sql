-- Enable realtime for content table
ALTER PUBLICATION supabase_realtime ADD TABLE public.content;

-- Enable full replica identity to capture complete row data
ALTER TABLE public.content REPLICA IDENTITY FULL;