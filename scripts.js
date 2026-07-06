(() => {

    class TimeSelect extends HTMLElement {

        #connected = false;
        #bOpen = false;

        constructor() {

            super();

            this.attachShadow({ mode: 'open' });

            this.sdRootControl = null;

            this.value = "office";

            this.fBodyClick = null;

            this.oDayMeta = {
                bWorkDay: true,
                bTCing: false,
                sType: "office"
            };

        }

        #bodyEvent(evt) {

            if (this.#bOpen && (evt.target !== this)) {
                
                this.#closePopup();

                this.#bOpen = !this.#bOpen;
            }

        }

        #emitEvent() {

            const emitEvent = new CustomEvent('change', {
                bubbles: true,
                cancelable: true
            });

            this.dispatchEvent(emitEvent)
        }

        #createOption(sType) {

            switch(sType) {

                case "office":

                    return `<button role="button" part="timeselect-option" value="office" data-workday="true">
                                <span class="icon" part="timeselect-option-emoji">&#127970;</span>
                                <span class="title" part="timeselect-option-emoji">Office</span>
                            </button>`;

                    break;

                case "vacation":

                    return `<button role="button" part="timeselect-option" value="vacation" data-workday="false">
                                <span class="icon" part="timeselect-option-emoji">&#127796;</span>
                                <span class="title" part="timeselect-option-emoji">Vacation</span>
                            </button>`;

                    break;

                case "telecommute":

                    return `<button role="button" part="timeselect-option" value="telecommute" data-workday="true">
                                <span class="icon" part="timeselect-option-emoji">&#128187;</span>
                                <span class="title" part="timeselect-option-emoji">WFH</span>
                            </button>`;

                    break;

                case "sick":

                    return `<button role="button" part="timeselect-option" value="sick" data-workday="false">
                                <span class="icon" part="timeselect-option-emoji">&#128567;</span>
                                <span class="title" part="timeselect-option-emoji">Sick</span>
                            </button>`;

                    break;

                case "holiday":

                    return `<button role="button" part="timeselect-option" value="holiday" data-workday="false">
                                <span class="icon" part="timeselect-option-emoji">&#127876;</span>
                                <span class="title" part="timeselect-option-emoji">Holiday</span>
                            </button>`;

                    break;

            }

        }

        #createPopup() {


            return `<div class="timeselect-popup" slot="select" id="options" part="select-options-container">
                ${(this.oDayMeta.sType !== "office") ? this.#createOption("office") : ""}
                ${(this.oDayMeta.sType !== "telecommute") ? this.#createOption("telecommute") : ""}
                ${(this.oDayMeta.sType !== "vacation") ? this.#createOption("vacation") : ""}
                ${(this.oDayMeta.sType !== "sick") ? this.#createOption("sick") : ""}
                ${(this.oDayMeta.sType !== "holiday") ? this.#createOption("holiday") : ""}
            </div>`;

        }

        #closePopup() {

            // Find an remove the popover
            let dPopover = this.shadowRoot.querySelector('#options');

            dPopover.parentNode.removeChild(dPopover);

            document.body.removeEventListener('click', this.fBodyClick);
        }

        // Evemts
        // Function when option is selected
        #optionSelected(evt) {

            let dTarget = evt.target;

            while(dTarget.nodeName !== "BUTTON") {
                dTarget = dTarget.parentNode;
            }

            let sValue = dTarget.value;
            let bWorkday = (dTarget.getAttribute('data-workday') === "true") ? true : false;
            let bTCing = (sValue === "telecommute") ? true : false;

            let sSelectedIcon = dTarget.querySelector('.icon').textContent;
            let sSelectedTitle = dTarget.querySelector('.title').textContent;

            this.sdActiveIcon.textContent = sSelectedIcon;
            this.sdActiveTitle.textContent = sSelectedTitle;

            this.oDayMeta.bWorkDay = bWorkday;
            this.oDayMeta.bTCing = bTCing;
            this.oDayMeta.sType = sValue;

            // Find an remove the popover
            let dPopover = this.shadowRoot.querySelector('#options');

            dPopover.parentNode.removeChild(dPopover);

            this.#bOpen = !this.#bOpen;

            this.#emitEvent();
        }

        #rootClick(evt) {

            //evt.stopPropagation();

            if (this.#bOpen) {

                this.#closePopup();

                this.#bOpen = false;
            }
            else {

                let sPopover = this.#createPopup();
    
                let dTemp = document.createElement('div');

                dTemp.innerHTML = this.#createPopup()

                let dOptionContainer = dTemp.querySelector('#options');

                dOptionContainer.addEventListener('click', this.#optionSelected.bind(this));
                dOptionContainer.addEventListener('keyup', this.#keyupPopover.bind(this));
    
                this.shadowRoot.append(dOptionContainer);
                
                this.#bOpen = true;

                this.fBodyClick = this.#bodyEvent.bind(this);

                document.body.addEventListener('click', this.fBodyClick);

            }


        }

        #keyupPopover(evt) {

            if (evt.key === "ArrowUp" || evt.key === "ArrowDown") {

                console.log("Arrows")
            }

        }

        #keyup(evt) {

            if (evt.key === "ArrowUp" || evt.key === "ArrowDown") {

                let sdPopover = document

                if (evt.key === "ArrowUp") {
                    
                    //let

                }
                else {
    
                }
            }

            if (evt.key === "Tab") {

                if (this.#bOpen) {

                    this.#closePopup();
                    this.#bOpen = false;
                }
                
            }

        }

        get template() {

            return `<button popovertarget="options" role="button" class="day-class-button" part="day-class-button office-day"  data-value="office">
                <span id="emjoi-icon" part="emjoi-icon">&#127970;</span>
                <span id="emjoi-title" part="emjoi-title">Office</span>
            </button><slot="select"></slot>`;
        }

        get isOpen() {

            return this.#bOpen;
        }

        get dayMeta() {

            return this.oDayMeta;
        }

        close() {
            if (this.#bOpen) {
                this.#closePopup();

                this.#bOpen = !this.#bOpen;
            }
        }

        connectedCallback() {

            this.render();

            this.#connected = true;
        }

        render() {

            if (!this.#connected) {

                this.shadowRoot.innerHTML = `${this.template}`;

                this.sdRootControl = this.shadowRoot.querySelector('button');

                this.sdActiveTitle = this.shadowRoot.querySelector(`#emjoi-title`);
                this.sdActiveIcon = this.shadowRoot.querySelector(`#emjoi-icon`);

                this.sdRootControl.addEventListener('click', this.#rootClick.bind(this));
                this.sdRootControl.addEventListener('keyup', this.#keyup.bind(this));
            }

        }

    }

    class PayPeriod extends HTMLElement {

        #connected = false;

        constructor() {

            super();

            this.attachShadow({ mode: 'open' });

            this.iTotalWorkDaya = 10;
            this.iOfficeDays = 5;
            this.iTCAllowed = 5;
        }

        #calculateStatus(evt) {

            let adTimeSelects = this.querySelectorAll('tcv-timeselect');

            let iTotalWorkDays = 0;
            let iTCDay = 0;
            let iOffice = 0;

            for (let t = 0, tLen = adTimeSelects.length; t < tLen; t++) {

                let oDayMeta = adTimeSelects[t].dayMeta;

                if (oDayMeta.sType === "office" || oDayMeta.sType === "telecommute") {
                    iTotalWorkDays += 1;
                }

                if (oDayMeta.bTCing) {
                    iTCDay += 1;
                }

                if (oDayMeta.bWorkDay && !oDayMeta.bTCing) {
                    iOffice += 1;
                }

            }

            const iRequiredOfficeDays = Math.ceil(iTotalWorkDays / 2);

            this.sdStatusTotalWorkDays.textContent = iTotalWorkDays;
            this.sdRequiredInOfficeDays.textContent = iRequiredOfficeDays;
            this.sdAllowedTCDays.textContent = iTotalWorkDays - iRequiredOfficeDays;

            if (iOffice >= iRequiredOfficeDays) {
                this.sdStatusIcon.textContent = "\u{2714}";
                this.sdStatusIcon.style.fontSize = `32px`;
                this.sdStatusIcon.style.color = `#1d9131`;

                this.classList.remove('error-status');
            }
            else {
                this.sdStatusIcon.textContent = "\u{2717}";
                this.sdStatusIcon.style.color = `#FF0000`;

                this.classList.add('error-status');
            }


        }

        get style() {

            return `:host { display:block;margin-top: 1em; }`
        }

        get template() {

            return `<div class="payperiod-wrapper" part="payperiod-wrapper">
                        <div class="payperiod-block" part="payperiod-block">
                            <div class="heading" part="heading monday">Monday</div>
                            <div class="heading" part="heading tuesday">Tuesday</div>
                            <div class="heading" part="heading wednesday">Wednesday</div>
                            <div class="heading" part="heading thursday">Thursday</div>
                            <div class="heading" part="heading friday">Friday</div>
                            <div class="offset leading" part="offset leading"></div>
                            <div class="w1-day thursday" part="day w1-day thursday">
                                <slot name="w1-thursday"></slot>
                            </div>
                            <div class="w1-day friday" part="day w1-day friday">
                                <slot name="w1-friday"></slot>
                            </div>
                            <div class="w1-day monday" part="day w1-day monday">
                                <slot name="w1-monday"></slot>
                            </div>
                            <div class="w1-day tuesday" part="day w1-day tuesday">
                                <slot name="w1-tuesday"></slot>
                            </div>
                            <div class="w1-day wednesday" part="day w1-day wednesday">
                                <slot name="w1-wednesday"></slot>
                            </div>
                            <div class="w2-day thursday" part="day w2-day thursday">
                                <slot name="w2-thursday"></slot>
                            </div>
                            <div class="w2-day friday" part="day w2-day friday">
                                <slot name="w2-friday"></slot>
                            </div>
                            <div class="w2-day monday" part="day w2-day monday">
                                <slot name="w2-monday"></slot>
                            </div>
                            <div class="w2-day tuesday" part="day w2-day tuesday">
                                <slot name="w2-tuesday"></slot>
                            </div>
                            <div class="w2-day wednesday" part="day w2-day wednesday">
                                <slot name="w2-wednesday"></slot>
                            </div>
                            <div class="offset trailing" part="offset trailing"></div>
                        </div>
                        <div class="status" part="status">
                            <div class="status-col" part="status-col">
                                <header part="row status-header">
                                    <span>TC Status:</span>
                                    <span id="status-icon" part="status-icon"></span>
                                </header>
                                <div part="row">
                                    <span class="">Total Work Days:</span>
                                    <span id="total-work-day">0</span>
                                </div>
                                <div part="row">
                                    <span class="">Required In Office Days:</span>
                                    <span id="require-in-office-days">0</span>
                                </div>
                                <div part="row">
                                    <span class="">Allowed TC Day:</span>
                                    <span id="total-allowed-tc-days">0</span>
                                </div>
                            </div>
                        </div>
                    </div>`;
        }

        updateStatus() {

            this.#calculateStatus();
        }

        connectedCallback() {

            this.shadowRoot.innerHTML = `<style>${this.style}</style>${this.template}`;

            this.#connected = true;

            this.sdStatusTotalWorkDays = this.shadowRoot.querySelector('#total-work-day');
            this.sdRequiredInOfficeDays = this.shadowRoot.querySelector('#require-in-office-days');
            this.sdAllowedTCDays = this.shadowRoot.querySelector('#total-allowed-tc-days');
            this.sdStatusIcon = this.shadowRoot.querySelector('#status-icon');

            // Bind change event to catch day type switches
            this.addEventListener('change', this.#calculateStatus.bind(this));
        }

    }

    customElements.define('tcv-payperiod', PayPeriod);
    customElements.define('tcv-timeselect', TimeSelect);

    document.body.addEventListener('keyup', (evt) => {

        if (event.key === 'Escape') {

            let adTimeSelects = document.querySelectorAll('tcv-timeselect');

            if (adTimeSelects.length) {

                for (let i = 0, iLen = adTimeSelects.length; i < iLen; i++) {

                    if (adTimeSelects[i].isOpen) {
                        adTimeSelects[i].close();
                    }

                }

            }

        }

    });

    let dAddWeekButton = document.querySelector('#add-week');

    dAddWeekButton.addEventListener('click', (evt) => {

        let dSection = document.querySelector('section');

        let adNewPayPerid = document.querySelectorAll('tcv-payperiod');

        let dNewPayPeriod = document.createElement('tcv-payperiod');
            dNewPayPeriod.classList.add('extraweek');

        for (let i = 0, iLen = 10; i < iLen; i++) {

            let dTimeSelect = document.createElement('tcv-timeselect');

            switch (i) {

                case 0:
                    dTimeSelect.setAttribute('slot', "w1-thursday");
                    break;

                case 1:
                    dTimeSelect.setAttribute('slot', "w1-friday");
                    break;

                case 2:
                    dTimeSelect.setAttribute('slot', "w1-monday");
                    break;

                case 3:
                    dTimeSelect.setAttribute('slot', "w1-tuesday");
                    break;

                case 4:
                    dTimeSelect.setAttribute('slot', "w1-wednesday");
                    break;

                case 5:
                    dTimeSelect.setAttribute('slot', "w2-thursday");
                    break;

                case 6:
                    dTimeSelect.setAttribute('slot', "w2-friday");
                    break;

                case 7:
                    dTimeSelect.setAttribute('slot', "w2-monday");
                    break;

                case 8:
                    dTimeSelect.setAttribute('slot', "w2-tuesday");
                    break;

                case 9:
                    dTimeSelect.setAttribute('slot', "w2-wednesday");
                    break;

            }

            dNewPayPeriod.append(dTimeSelect);

        }

        dNewPayPeriod.setAttribute('style', `position: relative; margin-top: -93px;`);

        dSection.append(dNewPayPeriod);

        dNewPayPeriod.updateStatus();

    });

    setTimeout(() => {

        let adPayPeriod = document.querySelector('tcv-payperiod');

        adPayPeriod.updateStatus();

    }, 100)

})();