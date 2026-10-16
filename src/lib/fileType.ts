export function getFileTypeMeta(fileUrl: string) {
  const ext = fileUrl.split(".").pop()?.toLowerCase() ?? "";

  if (ext === "pdf") {
    return { label: "PDF", bg: "bg-red-50", text: "text-red-600" };
  }
  if (ext === "ppt" || ext === "pptx") {
    return { label: "PPT", bg: "bg-orange-50", text: "text-orange-600" };
  }
  if (ext === "doc" || ext === "docx") {
    return { label: "DOC", bg: "bg-blue-50", text: "text-blue-600" };
  }
  if (ext === "zip" || ext === "rar") {
    return { label: ext.toUpperCase(), bg: "bg-purple-50", text: "text-purple-600" };
  }
  if (ext === "xls" || ext === "xlsx") {
    return { label: "XLS", bg: "bg-green-50", text: "text-green-600" };
  }
  return { label: ext ? ext.toUpperCase() : "FILE", bg: "bg-gray-100", text: "text-gray-600" };
}
