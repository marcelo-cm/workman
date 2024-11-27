const RectangleTLEdge = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 287 456"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M275 456H12C5.37259 456 0 450.627 0 444V83.2116C0 79.8872 1.37909 76.7117 3.80844 74.4424L80.0414 3.23083C82.2638 1.15477 85.1916 0 88.2329 0H275C281.627 0 287 5.37259 287 12V444C287 450.627 281.627 456 275 456Z"
          fill="#3F3F46"
        />
      </svg>
    </div>
  );
};

const RectangleTREdge = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 287 456"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M12 456H275C281.627 456 287 450.627 287 444V83.2116C287 79.8872 285.621 76.7117 283.192 74.4424L206.959 3.23083C204.736 1.15477 201.808 0 198.767 0H12C5.37258 0 0 5.37259 0 12V444C0 450.627 5.37258 456 12 456Z"
          fill="#3F3F46"
        />
      </svg>
    </div>
  );
};

const InverseRectangleTLEdge = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        viewBox="0 0 287 456"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M12 0H0V12C0 5.37259 5.37258 0 12 0ZM198.767 0C201.808 0 204.736 1.15477 206.959 3.23083L283.192 74.4424C285.621 76.7117 287 79.8872 287 83.2116V0H198.767ZM287 444C287 450.627 281.627 456 275 456H287V444ZM12 456C5.37258 456 0 450.627 0 444V456H12Z"
          fill="#27272A"
        />
      </svg>
    </div>
  );
};

const RectangleBLEdge = ({ className }: { className?: string }) => {
  return;
};

const RectangleBREdge = ({ className }: { className?: string }) => {
  return;
};

export {
  RectangleTLEdge,
  RectangleTREdge,
  RectangleBLEdge,
  RectangleBREdge,
  InverseRectangleTLEdge,
};
