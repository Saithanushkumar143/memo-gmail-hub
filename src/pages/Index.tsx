import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@/components/Auth";
import { NotesHeader } from "@/components/NotesHeader";
import { NoteCard } from "@/components/NoteCard";
import { NoteDialog } from "@/components/NoteDialog";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchNotes();
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (session?.user) {
        fetchNotes();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch notes",
      });
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .insert([{ title, content, user_id: user?.id }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      fetchNotes();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleUpdateNote = async (title: string, content: string) => {
    if (!editingNote) return;

    try {
      const { error } = await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", editingNote.id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      fetchNotes();
      setEditingNote(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleDeleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", noteToDelete);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
      fetchNotes();
      setNoteToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setNotes([]);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NotesHeader
        onCreateNote={() => {
          setEditingNote(null);
          setDialogOpen(true);
        }}
        onSignOut={handleSignOut}
        userEmail={user.email}
      />

      <main className="container mx-auto px-4 py-8">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
            <h2 className="text-2xl font-semibold mb-2">No notes yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first note to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                title={note.title}
                content={note.content || ""}
                onEdit={() => {
                  setEditingNote(note);
                  setDialogOpen(true);
                }}
                onDelete={() => {
                  setNoteToDelete(note.id);
                  setDeleteDialogOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </main>

      <NoteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={editingNote ? handleUpdateNote : handleCreateNote}
        initialTitle={editingNote?.title}
        initialContent={editingNote?.content}
        mode={editingNote ? "edit" : "create"}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNote}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
