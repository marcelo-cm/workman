import { memo } from 'react';

const BoxTLEdge = memo(({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 352 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M12 256H340C346.627 256 352 250.627 352 244V83.9446C352 80.1987 350.251 76.6678 347.271 74.3981L252.81 2.45358C250.721 0.861946 248.166 0 245.539 0H12C5.37258 0 0 5.37258 0 12V244C0 250.627 5.37259 256 12 256Z"
          fill="#3F3F46"
        />
      </svg>
    </div>
  );
});

const BoxTREdge = memo(({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <svg
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        viewBox="0 0 352 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M12 256H340C346.627 256 352 250.627 352 244V83.9446C352 80.1987 350.251 76.6678 347.271 74.3981L252.81 2.45358C250.721 0.861946 248.166 0 245.539 0H12C5.37258 0 0 5.37258 0 12V244C0 250.627 5.37259 256 12 256Z"
          fill="#3F3F46"
        />
      </svg>
    </div>
  );
});

const InverseBoxTLEdge = memo(({ className }: { className: string }) => {
  return (
    <div className={className}>
      <svg
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        viewBox="0 0 352 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M106.461 0H0V83.9446C0 80.1987 1.74902 76.6677 4.72949 74.3982L99.1895 2.45361C101.279 0.861938 103.834 0 106.461 0ZM340 0C346.627 0 352 5.37256 352 12V0H340ZM352 244C352 250.627 346.627 256 340 256H352V244ZM12 256C5.37305 256 0 250.627 0 244V256H12Z"
          fill="#27272A"
        />
      </svg>
    </div>
  );
});

const BoxBLEdge = ({ className }: { className: string }) => {};

const BoxBREdge = ({ className }: { className: string }) => {};

export { BoxTLEdge, BoxTREdge, BoxBLEdge, BoxBREdge, InverseBoxTLEdge };
