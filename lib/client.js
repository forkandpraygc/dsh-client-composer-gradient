window.__ModuleLoader__.load({
	id: "dsh-client-composer-gradient",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

		/** Marker attribute on <html>; every rule is scoped to it. */
		const ROOT_ATTRIBUTE = "data-dsh-composer-gradient";
		/** Style element id, so the plugin can find and remove its own sheet. */
		const STYLE_ID = "dsh-client-composer-gradient";

		const CSS = `
@property --dsh-cg-angle {
	syntax: "<angle>";
	inherits: false;
	initial-value: 0deg;
}

html[${ROOT_ATTRIBUTE}] [data-composer-card] {
	background-image: linear-gradient(
		115deg,
		rgba(255, 79, 163, 0.30) 0%,
		rgba(139, 92, 255, 0.28) 30%,
		rgba(60, 184, 255, 0.26) 55%,
		rgba(77, 255, 195, 0.24) 78%,
		rgba(255, 79, 163, 0.30) 100%
	);
	background-size: 300% 300%;
	background-position: 0% 50%;
	animation: dsh-cg-pan 18s ease-in-out infinite;
	box-shadow:
		var(--dsw-elevation-soft),
		0 0 26px -10px rgba(140, 120, 255, 0.45);
}

html[${ROOT_ATTRIBUTE}] [data-composer-card]::before {
	content: "";
	position: absolute;
	inset: -1px;
	border-radius: inherit;
	padding: 2px;
	background: conic-gradient(
		from var(--dsh-cg-angle, 0deg),
		#ff5fa2,
		#ffb266,
		#ffe66d,
		#5cffc4,
		#5ec8ff,
		#a78bfa,
		#ff5fa2
	);
	-webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	-webkit-mask-composite: xor;
	mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
	mask-composite: exclude;
	pointer-events: none;
	opacity: 0.72;
	z-index: 1;
	animation: dsh-cg-spin 9s linear infinite;
}

@keyframes dsh-cg-pan {
	0%,
	100% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
}

@keyframes dsh-cg-spin {
	to {
		--dsh-cg-angle: 360deg;
	}
}

@media (prefers-reduced-motion: reduce) {
	html[${ROOT_ATTRIBUTE}] [data-composer-card] {
		animation: none;
		background-position: 50% 50%;
	}
	html[${ROOT_ATTRIBUTE}] [data-composer-card]::before {
		animation: none;
		opacity: 0.4;
	}
}
`;

		/**
		 * Inject the animated gradient stylesheet once and scope it to a marker
		 * attribute on the root element. Removing the effect removes both.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => {
				const style = document.createElement("style");
				style.dataset.plugin = STYLE_ID;
				style.textContent = CSS;
				document.head.appendChild(style);
				document.documentElement.setAttribute(ROOT_ATTRIBUTE, "");

				return () => {
					style.remove();
					document.documentElement.removeAttribute(ROOT_ATTRIBUTE);
				};
			}, "composer-gradient: animated composer background");
		}

		exports.apply = apply;
		exports.CSS = CSS;
		exports.ROOT_ATTRIBUTE = ROOT_ATTRIBUTE;
		exports.STYLE_ID = STYLE_ID;
		return module.exports;
	},
});

