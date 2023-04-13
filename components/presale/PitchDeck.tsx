function PitchDeck() {
  return (
    <>
      <h2 className="w-full mb-2 text-2xl font-medium prose text-center">Welcome Video</h2>
      <iframe
        className="w-full h-full rounded-xl overflow-auto scrollbar-hide"
        scrolling="no"
        src="https://share.synthesia.io/embeds/videos/938f6a2e-0be5-4275-82ff-e164695ef8eb"
        loading="lazy"
        title="QuantiFi Welcome Video"
        allow="encrypted-media; fullscreen;"
      ></iframe>
    </>
  );
}

export default PitchDeck;