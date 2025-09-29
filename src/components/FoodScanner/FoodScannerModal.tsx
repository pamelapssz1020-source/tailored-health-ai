import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X, Upload, Lightbulb, Grid3x3, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FoodScannerModalProps {
  open: boolean;
  onClose: () => void;
  onCapture: (imageData: string) => void;
}

const FoodScannerModal = ({ open, onClose, onCapture }: FoodScannerModalProps) => {
  const { toast } = useToast();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (open) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [open]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1920, height: 1080 },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Erro ao acessar câmera",
        description: "Permita o acesso à câmera para escanear alimentos",
        variant: "destructive",
      });
      console.error("Camera error:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        onCapture(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        onCapture(imageData);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Escaneie Seu Alimento
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Camera Viewfinder */}
        <div className="relative bg-black aspect-[4/3] overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Overlay Grid */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
              {/* Center Focus Circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border-4 border-primary/60 animate-pulse" />
              </div>
            </div>
          )}

          {/* Tips Overlay */}
          <div className="absolute top-4 left-4 right-4 space-y-2 pointer-events-none">
            <div className="glass-effect p-2 rounded-lg flex items-center gap-2 text-xs text-white">
              <Lightbulb className="h-3 w-3 text-yellow-400" />
              <span>Use boa iluminação</span>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-white text-sm font-medium shadow-text">
              Centralize o alimento na grade
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-center gap-4">
            {/* Toggle Grid Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowGrid(!showGrid)}
              title="Alternar grade"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>

            {/* Capture Button */}
            <Button
              variant="hero"
              size="icon"
              className="h-16 w-16 rounded-full animate-pulse hover:animate-none"
              onClick={capturePhoto}
            >
              <Camera className="h-8 w-8" />
            </Button>

            {/* Upload Button */}
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
              <Button variant="outline" size="icon" asChild>
                <div>
                  <Upload className="h-4 w-4" />
                </div>
              </Button>
            </label>
          </div>

          {/* Tips */}
          <div className="text-center space-y-1">
            <p className="text-xs text-muted-foreground">
              💡 Mantenha o prato estável
            </p>
            <p className="text-xs text-muted-foreground">
              📏 Inclua uma referência (colher, moeda)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodScannerModal;
