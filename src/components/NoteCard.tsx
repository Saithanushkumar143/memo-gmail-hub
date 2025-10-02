import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

interface NoteCardProps {
  title: string;
  content: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const NoteCard = ({ title, content, onEdit, onDelete }: NoteCardProps) => {
  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-1 cursor-pointer animate-scale-in shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg truncate flex-1" onClick={onEdit}>
            {title}
          </h3>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent onClick={onEdit}>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {content || "No content"}
        </p>
      </CardContent>
    </Card>
  );
};
