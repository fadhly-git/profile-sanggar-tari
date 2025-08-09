import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu";
import { Eye } from "lucide-react";

interface SearchFilterProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    visibilityColumns: Array<{
        id: string;
        label: string;
        isVisible: boolean;
        canHide: boolean;
    }>;
    onVisibilityChange: (columnId: string, isVisible: boolean) => void;
}

export function SearchFilter({ 
    searchValue, 
    onSearchChange, 
    visibilityColumns, 
    onVisibilityChange 
}: SearchFilterProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="w-full sm:w-auto">
                <Input
                    placeholder="Cari judul berita..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-auto">
                        <Eye className="mr-2 h-4 w-4" />
                        Kolom
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {visibilityColumns
                        .filter(column => column.canHide)
                        .map(column => (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.isVisible}
                                onCheckedChange={(value) =>
                                    onVisibilityChange(column.id, !!value)
                                }
                            >
                                {column.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}