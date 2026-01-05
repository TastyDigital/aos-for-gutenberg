import AOS from "aos";
import { CountUp } from 'countUp.js';
import 'aos/dist/aos.css';

function ensureNumber(n) {
    return (typeof n === 'number' && !isNaN(n));
}

    AOS.init({
        offset: 0,
    });

    // Recalculate positions after everything is fully loaded and painted
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                AOS.refresh();
            });
        });
    });
    const countuppers = [];
    let counter = 0;

    document.addEventListener('aos:in:count-up', ({detail}) => {
        if(detail.dataset.aosTargetValue === undefined){
            let targetValue = Number(detail.textContent);
            let targetSuffix = '';
            if (!ensureNumber(targetValue)) {
                 let matches = detail.textContent.match(/(\d+)(\W+)/);
                 if (matches.length === 3){
                     targetValue = Number(matches[1]);
                     targetSuffix = matches[2];
                 }
            }
            detail.dataset.aosTargetValue = targetValue;
            detail.dataset.aosTargetSuffix = targetSuffix;
            detail.dataset.aosTargetId = counter;
            detail.id = 'count-up-element-'+counter;
            counter++;
        }
        countuppers[counter] = new CountUp(detail.children[0], detail.dataset.aosTargetValue, {
            suffix: detail.dataset.aosTargetSuffix,
            duration: 4
        });
        if (!countuppers[counter].error) {
            countuppers[counter].start();
        } else {
            console.error(countuppers[counter].error);
        }
    });
    document.addEventListener('aos:out:count-up', ({detail}) => {
        console.log('animated out', countuppers[detail.dataset.aosTargetId]);
        countuppers[detail.dataset.aosTargetId].reset()
    });
