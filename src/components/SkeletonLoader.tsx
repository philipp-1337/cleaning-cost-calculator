interface SkeletonLoaderProps {
  height?: string;
  width?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height = '24px', width = '100%', borderRadius = '4px', style }) => {
  return (
    <div
      className={
        `animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 `
      }
      style={{ height, width, borderRadius, ...style }}
    />
  );
};

export default SkeletonLoader;
