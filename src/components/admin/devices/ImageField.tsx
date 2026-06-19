import { useRef, useState } from "react";
import { ImagePlus, Link2, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadImageToS3 } from "@/lib/s3-upload";

/**
 * Reusable image picker for the admin catalog.
 * Uploads files directly to Amazon S3 (returns a public URL) OR accepts a
 * pasted image URL. Nothing is stored in Supabase, and SVG / PNG transparency
 * is preserved so logos never render as a black box.
 */
export function ImageField({
  label,
  value,
  onChange,
  shape = "contain",
  maxDim = 600,
  folder = "uploads",
  hint,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  shape?: "contain" | "cover";
  maxDim?: number;
  folder?: string;
  hint?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImageToS3(file, folder, { maxDim, quality: 0.82 }));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't upload the image.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyUrl = () => {
    const u = url.trim();
    if (!u) return;
    if (!/^https?:\/\//i.test(u) && !u.startsWith("data:")) {
      toast.error("Enter a valid image link starting with https://");
      return;
    }
    onChange(u);
    setUrl("");
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-start gap-3">
        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-secondary">
          {value ? (
            <img
              src={value}
              alt="preview"
              className={
                shape === "cover"
                  ? "size-full object-cover"
                  : "max-h-full max-w-full object-contain p-1.5"
              }
            />
          ) : (
            <ImagePlus className="size-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
              {value ? "Replace" : "Upload"}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => onChange(null)}
              >
                <X className="size-4" /> Remove
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyUrl();
                }
              }}
              placeholder="or paste image link (https://…)"
              className="h-9 text-xs"
            />
            <Button type="button" variant="secondary" size="sm" disabled={!url.trim()} onClick={applyUrl}>
              <Link2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.svg"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
