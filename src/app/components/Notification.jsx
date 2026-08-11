const Notification = ({ type, message }) => {
  return (
    <div className="toast toast-top toast-center">
      <div
        className={`alert ${
          type === "success" ? "alert-success" : "alert-error"
        }`}
      >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Notification;
