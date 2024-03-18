$(document).ready(function ($) {
    const allImages = [
        'portfolio/Cloud/A.png',
        'portfolio/Cloud/AA.png',
        'portfolio/Cloud/Asset 8.png',
        'portfolio/Cloud/Asset 9.png',
        'portfolio/Cloud/Asset 10.png',
        'portfolio/Cloud/Free Eco Package Mockup.jpg',
        'portfolio/Cloud/Free Restaurant Name Board Mockup.jpg',
        'portfolio/Cloud/Free_Id_Holder_Mockup_1.jpg',
        'portfolio/Cloud/free-business-card-mockup2_sachanati.com.jpg',
        'portfolio/Cloud/paper Bag Mockup (2).jpg',
        'portfolio/Cloud/Square_Sign_Mockup.jpg',
        'portfolio/Cloud/Web-Showcase-Project-Presentation.jpg',
        'portfolio/Gateway/Asset 1GateWay.png',
        'portfolio/Gateway/Asset 2GateWay.png',
        'portfolio/Gateway/Asset 3GateWay.png',
        'portfolio/Gateway/Asset 4GateWay.png',
        'portfolio/Gateway/Asset 10GateWay.png',
        'portfolio/Gateway/Asset 13GateWay.png',
        'portfolio/Gateway/Asset 15GateWay.png',
        'portfolio/Zena/Asset 6@2x.png',
        'portfolio/Zena/Asset 7@2x.png',
        'portfolio/Zena/Asset 8@2x.png',
        'portfolio/Zena/Asset 9@2x.png',
        'portfolio/Zena/Asset 10@2x.png',
        'portfolio/Zena/Asset 11@2x.png',
        'portfolio/Zena/Asset 12@2x.png',
        'portfolio/Zena/Asset 13@2x.png',
        'portfolio/Zena/Asset 14@2x.png',
        'portfolio/Zena/Asset 15@2x.png',
        'portfolio/Zena/Asset 16@2x.png',
        'portfolio/Zena/Asset 17@2x.png',
        'portfolio/Zena/Asset 18@2x.png',
        'portfolio/Zena/Asset 19@2x.png',
        'portfolio/Zena/Asset 20@2x.png',
        'portfolio/Zena/Asset 21@2x.png',
        'portfolio/Zena/Asset 22@2x.png',
        'portfolio/Zena/Asset 23@2x.png',
        'portfolio/Zena/Asset 24@2x.png',
        'portfolio/Zena/Asset 26@2x.png',
        'portfolio/Slab/Asset 1.png',
        'portfolio/Slab/Asset 3.png',
        'portfolio/Slab/Asset 4.png',
        'portfolio/Slab/Asset 5.png',
        'portfolio/Slab/Asset 6.png',
        'portfolio/Slab/Asset 7.png',
        'portfolio/Slab/Asset 8.png',
        'portfolio/Slab/Asset 9.png',
        'portfolio/Slab/Asset 10.png',
        'portfolio/Slab/Asset 11.png',
        'portfolio/Slab/Asset 12.5.png',
        'portfolio/Slab/Asset 12.png',
        'portfolio/Slab/Asset 13.png'
    ]

    // Generate image tags for each image
    const imageTags = allImages.map(image => `<img src="${image}" alt="${image} loading="lazy">`);
    // Get the reference to the current div
    var div = $('.imgHolder');
    imageTags.forEach(element => {
        div.append(element);
    });

});
