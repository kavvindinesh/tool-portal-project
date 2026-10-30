// NDT method selector.
// Each method has an evaluate() rule that looks at the chosen material,
// defect and access, and returns a verdict plus a plain-language reason.
// Rules follow FAA-H-8083-30 and AC 43.13-1B Chapter 5.

(function () {
  var YES = "recommended";
  var MAYBE = "possible";
  var NO = "unsuitable";

  function isMetal(material) {
    return material === "al" || material === "steel" || material === "nonmag";
  }

  function isCrack(defect) {
    return defect === "surfaceCrack" || defect === "holeCrack";
  }

  var METHODS = [
    {
      name: "Visual inspection",
      how: "Looking closely at the surface, often with a flashlight, mirror, magnifier or borescope (a thin camera on a cable).",
      evaluate: function (i) {
        if (i.defect === "internal") return [NO, "Flaws deep inside a part can't be seen from outside."];
        if (i.access === "hidden") return [MAYBE, "Only with a borescope or by removing panels to get a view."];
        if (i.defect === "water") return [MAYBE, "Look for blisters or bulges in the skin, but water inside the cells usually can't be seen."];
        if (i.defect === "delam") return [MAYBE, "Large delaminations may show as bulges, dents or cracked paint; small ones are invisible."];
        if (i.access === "coated") return [YES, "Always the first step. Paint can hide fine cracks, so look for cracked or bubbling paint."];
        return [YES, "Always the first step: a good light and a magnifier find many cracks and corrosion before any other method."];
      }
    },
    {
      name: "Liquid penetrant",
      how: "A coloured or fluorescent liquid is put on a clean surface, seeps into cracks, and is wiped off. A white powder (developer) then draws the liquid back out, showing the crack as a line.",
      evaluate: function (i) {
        if (!isMetal(i.material)) return [NO, "Composites can soak up the liquid, and it only finds flaws open to the surface."];
        if (!isCrack(i.defect)) return [NO, "Only finds cracks open to the surface; it can't see inside a part or measure thinning."];
        if (i.access === "hidden") return [NO, "The liquid must be put directly on a clean surface, so the area must be reachable."];
        if (i.access === "coated") return [MAYBE, "Paint must be stripped first: the liquid can't get into a crack through paint."];
        if (i.defect === "holeCrack") return [MAYBE, "Works only with the fastener removed, because its head covers the edge of the hole."];
        return [YES, "Simple and cheap way to show surface cracks on metal."];
      }
    },
    {
      name: "Magnetic particle",
      how: "The steel part is magnetised and covered with fine iron particles. A crack disturbs the magnetic field, and the particles gather along it.",
      evaluate: function (i) {
        if (i.material !== "steel") return [NO, "Only works on magnetic metals such as most steels, and this material isn't magnetic."];
        if (!isCrack(i.defect)) return [NO, "Finds cracks at or just below the surface; it can't measure corrosion or find deep flaws."];
        if (i.access === "hidden") return [NO, "The part must be reachable to magnetise it and see the particles."];
        if (i.access === "coated") return [MAYBE, "Works through thin paint but is less sensitive; thick coatings must be removed."];
        if (i.defect === "holeCrack") return [MAYBE, "Usually the fastener must be removed first."];
        return [YES, "Very sensitive to cracks at or just below the surface of steel parts."];
      }
    },
    {
      name: "Eddy current",
      how: "A probe with a coil creates small swirling electric currents (eddy currents) in the metal. A crack or thin spot changes those currents, and the instrument shows the change.",
      evaluate: function (i) {
        if (!isMetal(i.material)) return [NO, "Needs a material that conducts electricity well; composites don't."];
        if (i.defect === "internal") return [NO, "Eddy currents only reach a short way below the surface."];
        if (i.defect === "delam" || i.defect === "water") return [NO, "Not used for layers separating or trapped water; it finds cracks and thinning in metal."];
        if (i.material === "steel") return [MAYBE, "Can be used on steel, but magnetism limits how deep it reaches; magnetic particle is usually preferred for cracks."];
        if (i.defect === "corrosion") return [YES, "Low-frequency eddy current measures thinning through paint, even when the corrosion is on the far side of the skin."];
        if (i.access === "hidden") return [MAYBE, "Low-frequency eddy current can find some cracks in a layer under the skin, but less reliably."];
        if (i.defect === "holeCrack") return [YES, "Bolt-hole probes, or ring probes placed around fastener heads, find cracks at holes, often without removing fasteners."];
        return [YES, "Very sensitive to small surface cracks, and works through paint."];
      }
    },
    {
      name: "Ultrasonic",
      how: "A probe sends sound too high-pitched to hear into the part. The sound echoes back from the far side or from a flaw, and the timing shows where the flaw is.",
      evaluate: function (i) {
        if (i.access === "hidden") return [MAYBE, "Needs a surface to place the probe on, and sound may not cross gaps between separate layers."];
        if (i.defect === "internal") return [YES, "Sound bounces back from voids and inclusions deep inside the part."];
        if (i.defect === "delam") {
          if (isMetal(i.material)) return [MAYBE, "Can find bonded (glued) metal joints coming apart."];
          return [YES, "The standard method: sound bounces off the gap where layers have separated."];
        }
        if (i.defect === "corrosion") {
          if (isMetal(i.material)) return [YES, "A thickness gauge measures how much metal is left, working from one side."];
          return [MAYBE, "Can check for damage around metal fittings in the composite."];
        }
        if (i.defect === "water") return [MAYBE, "Can detect water in honeycomb cells, but X-ray usually shows it more clearly."];
        if (i.defect === "holeCrack") return [MAYBE, "Angle-beam ultrasonics can find cracks around holes without removing fasteners, but needs careful setup."];
        return [MAYBE, "Angle-beam ultrasonics can find surface cracks, but simpler methods usually come first."];
      }
    },
    {
      name: "Radiography (X-ray)",
      how: "X-rays pass through the part onto film or a digital detector. Thinner areas, voids and water show up as lighter or darker spots. Needs radiation safety precautions.",
      evaluate: function (i) {
        if (i.defect === "delam") return [NO, "Flat gaps between layers usually don't show on an X-ray; ultrasonic or tap test work better."];
        if (i.defect === "water") {
          if (i.material === "honeycomb") return [YES, "Water in the cells shows up clearly on an X-ray image."];
          return [MAYBE, "Can show trapped water inside a part."];
        }
        if (i.defect === "internal") return [YES, "Shows voids and inclusions inside the part as an image."];
        if (i.access === "hidden") return [MAYBE, "Sees through structure to hidden areas, but tight cracks show only if lined up with the X-ray beam."];
        if (i.defect === "corrosion") return [MAYBE, "Can show severe corrosion, but isn't good at measuring thickness."];
        return [NO, "Small cracks are easy to miss on an X-ray; surface methods work better."];
      }
    },
    {
      name: "Tap test",
      how: "Tap the surface lightly with a coin or small hammer and listen. A good bond sounds sharp; an area where layers have separated sounds dull.",
      evaluate: function (i) {
        if (i.access === "hidden") return [NO, "You must be able to tap the surface over the area."];
        if (isMetal(i.material)) {
          if (i.defect === "delam") return [MAYBE, "Can find disbonds in thin bonded metal skins."];
          return [NO, "Used on composite and bonded structure, not solid metal."];
        }
        if (i.defect === "delam") return [YES, "Quick and simple, but only finds separations near the surface in thin skins."];
        if (i.defect === "water") return [MAYBE, "Water-filled areas may sound duller than dry ones."];
        return [NO, "Only finds layers separating near the surface."];
      }
    }
  ];

  // Notes for combinations that are unusual, so students aren't misled.
  function comboNote(i) {
    if (i.defect === "water" && i.material !== "honeycomb") return "Water getting inside is mainly a honeycomb panel problem.";
    if (i.defect === "delam" && isMetal(i.material)) return "Delamination happens in layered composites. In metal structure, this means a bonded (glued) joint coming apart.";
    if (i.defect === "corrosion" && !isMetal(i.material)) return "Composites don't corrode, but metal fittings and fasteners in them can.";
    return "";
  }

  // Each group has a small icon (check, dash, cross) drawn as SVG paths.
  var GROUPS = [
    { verdict: YES, title: "Recommended", icon: "M5 12.5l4.5 4.5L19 7.5" },
    { verdict: MAYBE, title: "Possible", icon: "M6 12h12" },
    { verdict: NO, title: "Not suitable", icon: "M7 7l10 10M17 7L7 17" }
  ];

  var SVG_NS = "http://www.w3.org/2000/svg";

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(pathData) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "22");
    svg.setAttribute("height", "22");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
    return svg;
  }

  function render(form, results) {
    var input = {
      material: form.material.value,
      defect: form.defect.value,
      access: form.access.value
    };
    results.textContent = "";

    if (!input.material || !input.defect || !input.access) {
      results.appendChild(el("p", "hint", "Choose all three to see which methods fit."));
      return;
    }

    var note = comboNote(input);
    if (note) results.appendChild(el("p", "note", note));

    var evaluated = METHODS.map(function (method) {
      var outcome = method.evaluate(input);
      return { method: method, verdict: outcome[0], reason: outcome[1] };
    });

    GROUPS.forEach(function (group) {
      var items = evaluated.filter(function (e) { return e.verdict === group.verdict; });
      var section = el("section", "result-group result-" + group.verdict);
      var heading = el("h2");
      heading.appendChild(icon(group.icon));
      heading.appendChild(el("span", null, group.title));
      section.appendChild(heading);

      if (items.length === 0) {
        section.appendChild(el("p", "hint", group.verdict === YES
          ? "No method is clearly best here. See the possible methods below."
          : "None."));
      } else {
        var list = el("ul", "method-list");
        items.forEach(function (e) {
          var li = el("li");
          li.appendChild(el("h3", null, e.method.name));
          li.appendChild(el("p", null, e.reason));
          var details = el("details");
          details.appendChild(el("summary", null, "How it works"));
          details.appendChild(el("p", null, e.method.how));
          li.appendChild(details);
          list.appendChild(li);
        });
        section.appendChild(list);
      }
      results.appendChild(section);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("ndt-form");
    var results = document.getElementById("results");
    form.addEventListener("change", function () { render(form, results); });
    form.addEventListener("submit", function (event) { event.preventDefault(); });
    render(form, results);
  });
})();
