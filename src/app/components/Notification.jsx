const Notification = ({ type, message }) => {
  return (
    <div className="toast toast-top toast-center z-50 w-[calc(100%-2rem)] max-w-md px-0 pt-4 sm:pt-6">
      <div
        className={`alert ${
          type === "success" ? "alert-success" : "alert-error"
        } flex min-h-14 rounded-2xl border border-white/20 px-4 py-3 text-sm font-semibold shadow-2xl shadow-black/20 backdrop-blur-sm transition-all duration-300 sm:px-5 sm:text-base`}
        role={type === "success" ? "status" : "alert"}
        aria-live="polite"
      >
        <span className="min-w-0 wrap-break-word leading-6">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
