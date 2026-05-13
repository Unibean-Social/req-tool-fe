"use client"

import * as React from "react"
import Image, { type ImageProps } from "next/image"

import { cn } from "@/lib/utils"
import { formatImageUrl } from "@/lib/utils/format-image-url"

export type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined
  /** className khi không có URL hoặc load lỗi */
  fallbackClassName?: string
}

/**
 * next/image với src nullable, chuẩn hóa URL qua `formatImageUrl`,
 * và fallback khi thiếu URL hoặc `onError`.
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  onError,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = React.useState(false)
  const url = formatImageUrl(src)
  const isFill = "fill" in props && props.fill === true

  if (!url || failed) {
    return (
      <span
        role="img"
        aria-label={alt}
        className={cn(
          "inline-flex items-center justify-center bg-muted text-muted-foreground",
          isFill && "absolute inset-0 size-full",
          className,
          fallbackClassName
        )}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={alt}
      className={className}
      onError={(e) => {
        setFailed(true)
        onError?.(e)
      }}
      {...props}
    />
  )
}
