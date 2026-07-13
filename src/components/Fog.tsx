/** Manchas de niebla carmesí/violeta que derivan lentamente al fondo. */
export default function Fog() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="fog"
        style={{
          top: "-10%",
          left: "-15%",
          width: "55vw",
          height: "55vw",
          background: "radial-gradient(circle, rgba(220,20,60,0.14), transparent 65%)",
        }}
      />
      <div
        className="fog"
        style={{
          bottom: "-20%",
          right: "-10%",
          width: "60vw",
          height: "60vw",
          background: "radial-gradient(circle, rgba(88,28,135,0.18), transparent 65%)",
          animationDelay: "-11s",
          animationDuration: "28s",
        }}
      />
      <div
        className="fog"
        style={{
          top: "35%",
          left: "40%",
          width: "35vw",
          height: "35vw",
          background: "radial-gradient(circle, rgba(201,164,74,0.07), transparent 60%)",
          animationDelay: "-6s",
          animationDuration: "34s",
        }}
      />
    </div>
  );
}
