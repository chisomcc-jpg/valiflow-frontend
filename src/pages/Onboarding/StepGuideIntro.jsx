export default function StepGuideIntro({ onNext }) {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-semibold text-slate-800 mb-2">Välkommen till Valiflow 🎉</h1>
      <p className="text-slate-500 mb-6">
        Vi hjälper dig komma igång på under 2 minuter.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onNext}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
        >
          Starta guiden
        </button>
        <button onClick={onNext} className="text-slate-500 underline">
          Hoppa över
        </button>
      </div>
    </div>
  );
}
