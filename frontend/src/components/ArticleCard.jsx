// src/components/ArticleCard.jsx
import { ExternalLink } from "lucide-react";

export const ArticleCard = ({ category, title, date, body, href, image }) => {
  return (
    <a
      href={href}
      className="group bg-card p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Category + external link */}
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-primary">
        <span>{category}</span>
        <ExternalLink size={14} className="opacity-70 group-hover:opacity-100" />
      </div>

      {/* Title + date */}
      <div className="space-y-1">
        <h3 className="font-bold text-lg leading-snug text-foreground">
          {title}
        </h3>
        {date && (
          <p className="text-sm italic text-foreground/60">{date}</p>
        )}
      </div>

      {/* Body */}
      <p className="text-sm text-foreground/80 leading-relaxed">
        {body}
      </p>

      {/* Optional image */}
      {image && (
        <div className="mt-4 rounded-md overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
    </a>
  );
};