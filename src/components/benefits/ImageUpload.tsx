
import React, { useState } from "react";
import { Upload, X, Image, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      <div
        className={`relative border-2 border-dashed rounded-lg transition-all duration-200 ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {value ? (
          <div className="relative group">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={value}
                alt="Vista previa"
                className="w-full h-48 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
                isHovering ? 'opacity-100' : 'opacity-0'
              } flex items-center justify-center gap-2`}>
                <label htmlFor="file-upload-change" className="cursor-pointer">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 hover:bg-white text-black"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Cambiar
                    </span>
                  </Button>
                </label>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeImage}
                  className="bg-red-500/90 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <input
              id="file-upload-change"
              name="file-upload-change"
              type="file"
              className="sr-only"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary underline font-medium">
                    Haz clic para subir
                  </span>
                  <span className="text-muted-foreground"> o arrastra y suelta</span>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Dimensiones recomendadas: 680x352px
              </p>
              <p className="text-xs text-muted-foreground">
                Formatos: JPG, PNG, WebP (máx. 5MB)
              </p>
            </div>
          </div>
        )}
      </div>
      {value && (
        <p className="text-xs text-muted-foreground text-center">
          Pasa el mouse sobre la imagen para cambiarla o eliminarla
        </p>
      )}
    </div>
  );
};
