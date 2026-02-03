type MetadataItem = {
  type: string;
  url: string;
};

export function findMetadataUrl(
  metadata: MetadataItem[],
  targetType: string,
): string {
  const matched = metadata.find((item) => item.type === targetType);
  return matched?.url ?? metadata[0]?.url ?? "";
}

export function findCoverUrl(metadata: MetadataItem[]): string {
  const normalizedMetadata = metadata.map((item) => ({
    type: (item.type || "").toLowerCase(),
    url: item.url,
  }));

  return (
    normalizedMetadata.find((item) => item.type.includes("cover"))?.url ||
    normalizedMetadata.find((item) => item.type.includes("image"))?.url ||
    normalizedMetadata[0]?.url ||
    ""
  );
}
