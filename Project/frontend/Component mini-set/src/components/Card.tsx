
import type { ReactNode } from "react";

interface CardProps {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

function Card({ title, children, footer }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>

      <div className="card-content">
        {children}
      </div>

      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;
