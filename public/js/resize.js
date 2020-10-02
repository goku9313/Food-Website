function reportWindowSize() {
    if (window.innerWidth <= 720) {
        // if it was open then keep it open
        if (isOpen) {
            drop.parentElement.parentElement.style.top = "0px";
            drop.transform = "rotate(180deg)";
        }
        // otherwise close it 
        else {
            drop.parentElement.parentElement.style.top = "-192px";
            drop.style.transform = "rotate(0deg)";
        }
    } else {
        drop.parentElement.parentElement.style.top = "0px";
    }
}
window.onresize = reportWindowSize;