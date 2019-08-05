(function(){
            
    let modal = document.getElementById("modal");
        modal.addEventListener("click", event => {
            if(!event.target.id || event.target.id !== "select") { return }
                event.currentTarget.classList.add("hidden");
                init()
        }) 
      
    function init() {
        let total = +document.getElementById("options").value; //total number of marker holders, e.g. 9, 16, 25
        let row = Math.sqrt(total); // number of rows, e.g. 3, 4, 5
        let current = Math.round( Math.floor(Math.random() * ((total - 1) - 0)) + 0 ); // current position of the marker
        let numberOfSteps = 10;
        let selectedMarker = null; 
        let config = [
            {
                position: "left",
                step: -1
            },
            {
                position: "right",
                step: +1
            },
            {
                position: "up",
                step: -total/row
            },
            {
                position: "down",
                step: +total/row
            }
        ];  
        let stepsContainer = document.getElementById("steps-container");
        let markerContainer = document.getElementById("marker-container");
        let markerHolders;
        let wrapper = document.getElementById("wrapper");
        let startButton = document.getElementById("start-button");
        /// FILL MARKER-CONTAINER WITH ITEMS ///
        for(let i = 0; i < total; i++) {
            let item = document.createElement("div");
            item.className = "marker-item";
            item.id = i;
            markerContainer.appendChild(item)
        }
        /// SET A MARKER ///
        markerHolders = document.querySelectorAll(".marker-item");
        markerHolders[current].classList.add("marker")
        /// SET APPROPRIATE STYLES FOR THE WRAPPER ///
        wrapper.classList.add(`items-${total}`); // e.g. items-9, items-16, items-25
        /// START A GAME  ////
        startButton.addEventListener("click", startGame)
        
        function startGame() {
            startButton.disabled = true;
            startButton.removeEventListener("click", startGame)

            let i = 0;
            i++;

            getRandomStep()

            let showStep = setInterval( () => {
                i++;

                getRandomStep()

                if(i >= numberOfSteps) {
                    clearInterval(showStep);

                    startButton.innerText = "Choose";
                    startButton.addEventListener("click", selectMarkerHolder);
                    document.addEventListener("click", highlightMarkerHolder);
                }
            }, 500);
        }

        function getRandomStep() {
            let random = Math.round( Math.floor(Math.random() * (4 - 0)) + 0 ); // 4 means config variable length
     
            let step = current + config[random].step; // step = current + ( +1, -1, +3, -3 ), etc
            if(step < 0 || step > total - 1) {
                return getRandomStep()
            }
            current = step;
            /// CREATE A STEP ITEM ///
            let item = document.createElement("div");
                item.className = `steps-item ${config[random].position} hidden`; // e.g. steps-item left, right, etc
            stepsContainer.appendChild(item);
            setTimeout(()=>{
                item.classList.remove("hidden"); //hidden class is responsible for animation effect
            }, 250)
        }
        
        function highlightMarkerHolder(event) {
            let { target } = event;
            if(!target || !target.classList.contains("marker-item") ) { return }
            startButton.disabled = false;
            markerHolders.forEach(m => m.classList.remove("selected")) 
            target.classList.add("selected"); // highlight selected marker holder
            selectedMarker = target.id;
        }
        
        function selectMarkerHolder() {
            let answerGuessed = +selectedMarker === current;
            
            if(answerGuessed) {
                markerHolders[selectedMarker].style.backgroundColor = "greenyellow";
            }
            else {
                markerHolders[current].style.backgroundColor = "red";
            }

            setTimeout(() => {
                modal.classList.remove("hidden");
                /// RESTART A GAME ///
                /// REMOVE STEPS AND MARKERS ITEMS ///
                markerContainer.innerHTML = '';
                stepsContainer.innerHTML = '';

                wrapper.className = "wrapper"; // remove items-9, items-16, etc, classes
                
                startButton.innerText = "Start";
                startButton.removeEventListener("click", selectMarkerHolder);
                document.removeEventListener("click", highlightMarkerHolder);

                let modalText = document.getElementById("modalText");
                if(answerGuessed) {
                    modalText.innerText = "Well done:)"
                }
                else {
                    modalText.innerText = "Failed:("
                }
            }, 1500)        

        }

    }
    
}())