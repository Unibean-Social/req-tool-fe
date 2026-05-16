import {
  PROJECT_MIN_TEXT_CHARS,
  PROJECT_MIN_TEXT_MESSAGE,
} from "./projectFormLimits";

/** Hiện lỗi sau khi bấm Tiếp/Tạo, hoặc ngay khi đã gõ nhưng chưa đủ ký tự tối thiểu. */
export function resolveProjectNewTextFieldError(
  value: string,
  schemaError: string | undefined,
  showSubmitErrors: boolean
): string | undefined {
  if (showSubmitErrors && schemaError) return schemaError;
  const len = value.trim().length;
  if (len > 0 && len < PROJECT_MIN_TEXT_CHARS) {
    return schemaError ?? PROJECT_MIN_TEXT_MESSAGE;
  }
  return undefined;
}

/** Lỗi cấp danh sách (vd. chưa có mục nào) — chỉ sau khi cố gắng submit bước. */
export function resolveProjectNewListRootError(
  schemaError: string | undefined,
  showSubmitErrors: boolean
): string | undefined {
  if (!schemaError || !showSubmitErrors) return undefined;
  return schemaError;
}

export function resolveProjectNewListItemError(
  item: string,
  schemaError: string | undefined,
  showSubmitErrors: boolean
): string | undefined {
  return resolveProjectNewTextFieldError(item, schemaError, showSubmitErrors);
}
