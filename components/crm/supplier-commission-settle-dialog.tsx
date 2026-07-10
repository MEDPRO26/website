"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  COMMISSION_PAYMENT_METHODS,
  commissionPaymentRequiresReceipt,
  type CommissionPaymentMethod,
} from "@/lib/crm/commission-payment";
import { formatMad } from "@/lib/crm/pricing";

type SettleTarget = {
  quoteId: Id<"orderSupplierQuotes">;
  orderRef: string;
  commissionAmount: number;
};

export function SupplierCommissionSettleDialog({
  open,
  onOpenChange,
  target,
  onSettled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: SettleTarget | null;
  onSettled: () => void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<CommissionPaymentMethod | "">("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const fallbackCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const generateUploadUrl = useMutation(
    api.supplierPortal.generateCommissionReceiptUploadUrl
  );
  const markSettled = useMutation(api.supplierPortal.markCommissionSettled);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOpen(false);
    setCameraStarting(false);
  }, []);

  useEffect(() => {
    if (!open) {
      stopCamera();
      setPaymentMethod("");
      setReceiptFile(null);
      setReceiptPreview(null);
      setSubmitting(false);
    }
  }, [open, stopCamera]);

  useEffect(() => {
    if (!receiptFile) {
      setReceiptPreview(null);
      return;
    }
    const url = URL.createObjectURL(receiptFile);
    setReceiptPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [receiptFile]);

  useEffect(() => {
    if (!cameraOpen || !videoRef.current || !streamRef.current) return;

    const video = videoRef.current;
    video.srcObject = streamRef.current;
    void video.play().catch(() => {
      toast.error("Impossible d'afficher la caméra.");
      stopCamera();
    });
  }, [cameraOpen, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const requiresReceipt = commissionPaymentRequiresReceipt(paymentMethod);

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez choisir une image (photo du reçu).");
      return;
    }
    setReceiptFile(file);
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      fallbackCameraInputRef.current?.click();
      return;
    }

    setCameraStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      fallbackCameraInputRef.current?.click();
    } finally {
      setCameraStarting(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) {
      toast.error("La caméra n'est pas prête.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      toast.error("Impossible de capturer la photo.");
      return;
    }

    context.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Impossible de capturer la photo.");
          return;
        }
        const file = new File([blob], `recu-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        handleFileChange(file);
        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  const handleSubmit = async () => {
    if (!target) return;
    if (!paymentMethod) {
      toast.error("Choisissez un mode de règlement.");
      return;
    }
    if (requiresReceipt && !receiptFile) {
      toast.error("Ajoutez une photo du reçu bancaire.");
      return;
    }

    setSubmitting(true);
    try {
      let receiptStorageId: Id<"_storage"> | undefined;

      if (requiresReceipt && receiptFile) {
        const uploadUrl = await generateUploadUrl();
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": receiptFile.type },
          body: receiptFile,
        });
        if (!uploadResult.ok) {
          throw new Error("Impossible d'envoyer la photo du reçu.");
        }
        const payload = (await uploadResult.json()) as { storageId: Id<"_storage"> };
        receiptStorageId = payload.storageId;
      }

      await markSettled({
        quoteId: target.quoteId,
        paymentMethod,
        receiptStorageId,
      });

      toast.success("Commission marquée comme réglée.");
      onSettled();
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Impossible de confirmer le règlement."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmer le règlement</DialogTitle>
          <DialogDescription>
            {target
              ? `Commande ${target.orderRef} · commission ${formatMad(target.commissionAmount)}`
              : "Indiquez comment vous avez réglé la commission SOS Santé."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Mode de règlement <span className="text-[var(--danger)]">*</span>
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => {
                setPaymentMethod(value as CommissionPaymentMethod);
                if (!commissionPaymentRequiresReceipt(value as CommissionPaymentMethod)) {
                  setReceiptFile(null);
                  stopCamera();
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un mode de paiement" />
              </SelectTrigger>
              <SelectContent>
                {COMMISSION_PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {requiresReceipt ? (
            <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
              <p className="text-sm font-medium">
                Reçu bancaire <span className="text-[var(--danger)]">*</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Prenez une photo du reçu avec la caméra ou importez une image depuis votre
                galerie.
              </p>

              {cameraOpen ? (
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-lg border border-border bg-black">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="absolute right-2 top-2 size-8 rounded-full"
                      onClick={stopCamera}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <Button type="button" className="w-full" onClick={capturePhoto}>
                    <Camera className="mr-2 size-4" />
                    Capturer la photo
                  </Button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={cameraStarting}
                    onClick={() => void openCamera()}
                  >
                    {cameraStarting ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Camera className="mr-2 size-4" />
                    )}
                    Prendre une photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => uploadInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-2 size-4" />
                    Importer une photo
                  </Button>
                </div>
              )}

              <input
                ref={fallbackCameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(event) => {
                  handleFileChange(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  handleFileChange(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />

              {receiptPreview ? (
                <div className="overflow-hidden rounded-lg border border-border/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={receiptPreview}
                    alt="Aperçu du reçu"
                    className="max-h-48 w-full object-contain bg-white"
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button type="button" onClick={() => void handleSubmit()} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Envoi…
              </>
            ) : (
              "Confirmer le règlement"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
