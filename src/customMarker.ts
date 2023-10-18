interface Options {
  uuid: string;
  label: string;
}

/**
 * @link https://stackoverflow.com/questions/77316855/how-can-i-resolve-the-custommarker-ts6-uncaught-referenceerror-google-is-not
 */

const factory = () => {
  class CustomMarker extends google.maps.OverlayView {
    readonly #uuid: string;
    readonly #label: string;
    #position: google.maps.LatLng | google.maps.LatLngLiteral | null;
    #div: HTMLDivElement | null;

    constructor({ uuid, label }: Options) {
      super();

      this.#uuid = uuid;
      this.#label = label;
      this.#position = null;

      this.#div = null;
    }

    get uuid() {
      return this.#uuid;
    }

    get label() {
      return this.#label;
    }

    set position(
      position:
        | google.maps.LatLng
        | google.maps.LatLngLiteral
        | null
        | undefined
    ) {
      if (typeof position === "undefined") {
        return;
      }

      this.#position = position;
    }

    onAdd() {
      const div = document.createElement("div");
      div.style.position = "absolute";
      div.draggable = true;

      div.innerHTML = `
              <div style="background-color: white; padding: 5px;">
                <button>정보</button>
                <button>삭제</button>
              </div>
              <div style="text-align: center;">Mapping point 1</div>
            `;

      div.querySelector("button")!.addEventListener("click", (e) => {
        console.log("버튼 클릭됨!");
      });

      this.#div = div;
      const panes = this.getPanes()!;
      panes.overlayMouseTarget.appendChild(this.#div);
    }

    draw() {
      const overlayProjection = this.getProjection();
      const position = overlayProjection.fromLatLngToDivPixel(this.#position);
      const div = this.#div;

      if (!div || !position) {
        return;
      }

      div.style.left = position.x + "px";
      div.style.top = position.y + "px";
    }

    onRemove() {
      if (!this.#div || !this.#div.parentNode) {
        return;
      }

      this.#div.parentNode.removeChild(this.#div);
      this.#div = null;
    }
  }

  return ({ uuid, label }: Options) => new CustomMarker({ uuid, label });
};

export default factory;
