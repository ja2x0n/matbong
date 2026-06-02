import styles from "./Button.module.css";

const variants = {
  primary: styles.primary,
  ghost: styles.ghost,
  danger: styles.danger,
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      className={`${styles.button} ${variants[variant]} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
