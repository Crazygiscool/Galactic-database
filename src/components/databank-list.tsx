import { DatabankItem, Section } from "@/hooks/use-swapi";

interface DatabankListProps {
  items: DatabankItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function DatabankList({
  items,
  selectedId,
  onSelect,
}: DatabankListProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 12px",
            background:
              selectedId === item.id
                ? "color-mix(in srgb, var(--primary) 12%, transparent)"
                : "var(--muted)",
            border: `1px solid ${
              selectedId === item.id
                ? "color-mix(in srgb, var(--primary) 50%, transparent)"
                : "var(--border)"
            }`,
            borderRadius: 4,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (selectedId !== item.id) {
              e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 8%, transparent)";
              e.currentTarget.style.borderColor = "var(--border)";
            }
          }}
          onMouseLeave={(e) => {
            if (selectedId !== item.id) {
              e.currentTarget.style.background = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
              overflow: "hidden",
              flexShrink: 0,
              background: "var(--muted)",
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontFamily: "'Share Tech Mono', monospace",
                color:
                  selectedId === item.id
                    ? "var(--foreground)"
                    : "var(--primary)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 4,
                textShadow:
                  selectedId === item.id
                    ? "0 0 8px color-mix(in srgb, var(--primary) 50%, transparent)"
                    : "none",
              }}
            >
              {item.name}
            </div>
            <div
              style={{
                fontSize: 10,
                fontFamily: "'Share Tech Mono', monospace",
                color: "var(--muted-foreground)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.description?.slice(0, 80)}...
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface DatabankDetailPanelProps {
  item: DatabankItem & { planetId?: string };
  onClose: () => void;
  onLinkClick?: (section: Section, id: string) => void;
}

export function DatabankDetailPanel({
  item,
  onClose,
  onLinkClick,
}: DatabankDetailPanelProps) {
  return (
    <div className="w-full h-full flex flex-col relative z-20">
      <div className="p-4 border-b border-primary/30 bg-card/90 flex justify-between items-center backdrop-blur-md">
        <h2 className="text-xl font-bold glow-text tracking-widest uppercase">
          DATABASE ENTRY
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid transparent",
            padding: 4,
            cursor: "pointer",
            color: "var(--muted-foreground)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--foreground)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--muted-foreground)";
            e.currentTarget.style.borderColor = "transparent";
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div
          style={{
            height: 200,
            overflow: "hidden",
            background: "var(--muted)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <img
            src={item.image}
            alt={item.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        <div className="p-4">
          {item.planetId && (
            <button
              onClick={() =>
                onLinkClick && onLinkClick("planets", item.planetId!)
              }
              style={{
                fontSize: 10,
                color: "var(--primary)",
                padding: "3px 8px",
                border: "1px solid var(--border)",
                background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 8,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 20%, transparent)";
                e.currentTarget.style.borderColor = "var(--primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "color-mix(in srgb, var(--primary) 8%, transparent)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              VIEW ON MAP
            </button>
          )}

          <div className="text-xs text-primary/50 mb-1">RECORD.ID</div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: "var(--foreground)",
              textShadow: "0 0 10px color-mix(in srgb, var(--primary) 50%, transparent)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 16,
              fontFamily: "'Share Tech Mono', monospace",
            }}
          >
            {item.name}
          </h1>

          <div
            style={{
              fontSize: 11,
              fontFamily: "'Share Tech Mono', monospace",
              color: "var(--muted-foreground)",
              lineHeight: 1.6,
              padding: "12px",
              background: "var(--muted)",
              border: "1px solid var(--border)",
              borderRadius: 4,
            }}
          >
            {item.description}
          </div>
        </div>
      </div>

      <div
        style={{
          height: 28,
          borderTop: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          fontSize: 10,
          color: "var(--muted-foreground)",
          fontFamily: "'Share Tech Mono', monospace",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--primary)",
            }}
          />
          TERMINAL ONLINE
        </span>
        <span>SYS.V 1.0.4</span>
      </div>
    </div>
  );
}
