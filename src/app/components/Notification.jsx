const Notification = ({ type, message }) => {
  return (
    <div className="toast toast-top toast-end z-50 w-[calc(100%-1rem)] max-w-xs px-0 pt-3 sm:pt-4">
      <div
        className={`alert ${
          type === "success" ? "alert-success" : "alert-error"
        } flex min-h-10 rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold shadow-xl shadow-black/20 backdrop-blur-sm transition-all duration-300 sm:text-sm`}
        role={type === "success" ? "status" : "alert"}
        aria-live="polite"
      >
        <span className="min-w-0 wrap-break-word leading-5">{message}</span>
      </div>
    </div>
  );
};

export default Notification;
