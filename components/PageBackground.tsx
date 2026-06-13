export default function PageBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#141414]" />

      <div className="page-bg-orb page-bg-orb-center" />
      <div className="page-bg-orb page-bg-orb-tr" />
      <div className="page-bg-orb page-bg-orb-bl" />

      <div className="page-bg-grid absolute inset-0" />
      <div className="page-bg-noise absolute inset-0" />
      <div className="page-bg-vignette absolute inset-0" />
    </div>
  );
}
