import React, { useState, useRef, useEffect } from "react";
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close, ZoomIn, ZoomOut, Crop } from "@mui/icons-material";

interface ImageCropperModalProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string | null;
  aspectRatio: number; // e.g. 1 para 1:1, 2 para 2:1 (ancho / alto)
  onCrop: (croppedImageBase64: string) => void;
  title?: string;
  recommendationText?: string;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  open,
  onClose,
  imageSrc,
  aspectRatio,
  onCrop,
  title = "Ajustar Imagen",
  recommendationText = "Arrastra la imagen para encuadrarla y usa el deslizador para hacer zoom.",
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reiniciar estados al abrir/cambiar imagen
  useEffect(() => {
    if (open) {
      setZoom(1);
      setOffset({ x: 0, y: 0 });
    }
  }, [open, imageSrc]);

  if (!imageSrc) return null;

  // --- Manejadores de Arrastre (Mouse) ---
  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setOffset({ x: newX, y: newY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // --- Manejadores de Arrastre (Touch para móviles) ---
  const handleTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
    }
  };

  const handleTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStart.current.x;
      const newY = touch.clientY - dragStart.current.y;
      setOffset({ x: newX, y: newY });
    }
  };

  // --- Procesar Recorte con HTML5 Canvas ---
  const handleConfirmCrop = () => {
    const img = imgRef.current;
    const container = containerRef.current;
    if (!img || !container) return;

    // Obtener dimensiones reales del contenedor de la máscara
    const maskEl = container.querySelector(".crop-mask") as HTMLElement;
    if (!maskEl) return;

    const maskRect = maskEl.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    // Crear canvas con tamaño final sugerido de alta calidad
    const canvas = document.createElement("canvas");
    const targetWidth = aspectRatio === 1 ? 400 : 800;
    const targetHeight = targetWidth / aspectRatio;
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Calcular proporciones y coordenadas de origen en base al escalado actual de la imagen en pantalla
    const scaleX = img.naturalWidth / imgRect.width;
    const scaleY = img.naturalHeight / imgRect.height;

    // Distancia desde el borde de la imagen al borde de la máscara
    const sourceX = (maskRect.left - imgRect.left) * scaleX;
    const sourceY = (maskRect.top - imgRect.top) * scaleY;
    const sourceWidth = maskRect.width * scaleX;
    const sourceHeight = maskRect.height * scaleY;

    // Dibujar en el canvas
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );

    // Exportar como base64
    const base64 = canvas.toDataURL("image/jpeg", 0.9);
    onCrop(base64);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: 3, overflow: "hidden" },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 1.5,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Crop sx={{ color: "primary.main" }} />
          <Typography variant="h6" fontWeight={700}>
            {title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={2.5}>
          {recommendationText}
        </Typography>

        {/* Contenedor del Editor / Canvas interactivo */}
        <Box
          ref={containerRef}
          sx={{
            position: "relative",
            width: "100%",
            height: 320,
            backgroundColor: "#0f172a",
            borderRadius: 2,
            overflow: "hidden",
            cursor: isDragging ? "grabbing" : "grab",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
        >
          {/* Imagen de Fondo */}
          <Box
            component="img"
            ref={imgRef}
            src={imageSrc}
            alt="Original"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
              maxHeight: "80%",
              maxWidth: "80%",
              userSelect: "none",
              pointerEvents: "none",
              objectFit: "contain",
              transition: isDragging ? "none" : "transform 0.05s ease-out",
            }}
          />

          {/* Máscara y Cuadro de Recorte */}
          <Box
            className="crop-mask"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: aspectRatio === 1 ? 200 : 280,
              height: aspectRatio === 1 ? 200 : 140,
              borderRadius: aspectRatio === 1 ? "50%" : 1,
              boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.6)",
              border: "2px solid #38bdf8",
              pointerEvents: "none",
              zIndex: 10,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "1px dashed rgba(255, 255, 255, 0.5)",
                borderRadius: "inherit",
              },
            }}
          />
        </Box>

        {/* Controles de Zoom */}
        <Box width="100%" display="flex" alignItems="center" gap={2} mt={3} px={1}>
          <ZoomOut color="action" />
          <Slider
            value={zoom}
            min={0.2}
            max={4}
            step={0.05}
            onChange={(_, val) => setZoom(val as number)}
            aria-label="Zoom"
            sx={{
              color: "primary.main",
              "& .MuiSlider-thumb": {
                width: 20,
                height: 20,
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "0px 0px 0px 8px rgba(20, 184, 166, 0.16)",
                },
              },
            }}
          />
          <ZoomIn color="action" />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, borderTop: "1px solid", borderColor: "divider", gap: 1.5 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, px: 3 }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmCrop}
          startIcon={<Crop />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            fontWeight: 600,
            px: 4,
            bgcolor: "teal.600",
            "&:hover": { bgcolor: "teal.700" },
          }}
        >
          Recortar y Aplicar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
