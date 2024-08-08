const starsContainer = document.getElementById('stars-container');
const numStars = 200;
const shootingStarInterval = 2000; // Interval between shooting stars

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.width = `${Math.random() * 3 + 1}px`;
    star.style.height = `${Math.random() * 3 + 1}px`;
    star.style.animationDuration = `${Math.random() * 3 + 1}s`;
    star.style.animationDelay = `${Math.random() * 3}s`;
    starsContainer.appendChild(star);
}

function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    shootingStar.style.top = `${Math.random() * 50}%`;
    shootingStar.style.left = `${Math.random() * 100}%`;
    shootingStar.style.animationDuration = `${Math.random() * 4 + 1}s`;
    shootingStar.style.animationDelay = `${Math.random() * 4}s`;
    starsContainer.appendChild(shootingStar);

    shootingStar.addEventListener('animationend', () => {
        shootingStar.remove();
    });
}

function triggerShootingStars() {
    createShootingStar();
    const nextShootingStarIn = Math.random() * 2000 + shootingStarInterval;
    setTimeout(triggerShootingStars, nextShootingStarIn);
}

function initStars() {
    for (let i = 0; i < numStars; i++) {
        createStar();
    }
}

// Function to scroll to the next section
function scrollToNextSection() {
    console.log("scrollToNextSection called"); // Test: Check if function is called

    // Get all sections
    const sections = document.querySelectorAll('.section');
    let nextSection = null;

    // Loop through sections to find the currently visible one
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        // Check if the top of the section is near the top of the viewport
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
            if (i < sections.length - 1) {
                nextSection = sections[i + 1]; // The next section to scroll to
            }
            break;
        }
    }

    // Scroll to the next section if found
    if (nextSection) {
        console.log("Next section found, scrolling..."); // Test: Confirm the next section is found
        nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.log("No next section found"); // Test: Inform if no section was found
    }
}


// Initialize stars and shooting stars when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initStars();
    triggerShootingStars();

    // Add click event listener to the chevron icon
    const chevron = document.getElementById('scroll-chevron');
    if (chevron) {
        console.log("Chevron found, adding click event listener"); // Test: Confirm chevron is found
        chevron.addEventListener('click', scrollToNextSection);
    } else {
        console.log("Chevron not found"); // Test: Inform if chevron is not found
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const menu = document.querySelector('.menu');

    if (mobileMenuToggle && menu) {
        mobileMenuToggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
});

// Test: Add a simple button for testing scroll function
//const testButton = document.createElement('button');
//testButton.textContent = "Scroll to Next Section";
//testButton.style.position = 'fixed';
//testButton.style.bottom = '20px';
//testButton.style.left = '20px';
//document.body.appendChild(testButton);
//testButton.addEventListener('click', scrollToNextSection);
