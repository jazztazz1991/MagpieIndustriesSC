import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.icon} aria-hidden="true">
        !
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
        >
          Try again
        </button>
      )}
    </div>
  );
}
