import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface MenuItem {
  href: string;
  title: string;
  image: string;
}

interface MenuProps {
  onMenuClick: (menuType: string) => void;
}

const Menu: React.FC<MenuProps> = ({ onMenuClick }) => {
  const menuItems: MenuItem[] = [
    {
      href: 'hot-coffee.html',
      title: 'Hot Coffee',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80'
    },
    {
      href: 'cold-coffee.html',
      title: 'Cold Coffee',
      image: 'https://ichef.bbci.co.uk/food/ic/food_16x9_1600/recipes/iced_coffee_01204_16x9.jpg'
    },
    {
      href: 'snacks.html',
      title: 'Snacks',
      image: 'https://barefeetinthekitchen.com/wp-content/uploads/2018/07/Ice-Cream-Cookie-Sandwiches-5-1-of-1.jpg'
    },
    {
      href: 'dessert.html',
      title: 'Dessert',
      image: 'https://www.kingarthurbaking.com/sites/default/files/2025-06/Easy-Cheesecake-6.jpg'
    }
  ];

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 800,
    arrows: true,
    dots: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === 'cold-coffee.html') {
      e.preventDefault();
      onMenuClick('cold-coffee');
    } else if (href === 'dessert.html') {
      e.preventDefault();
      onMenuClick('dessert');
    } else if (href === 'hot-coffee.html') {
      e.preventDefault();
      onMenuClick('hot-coffee');
    } else if (href === 'snacks.html') {
      e.preventDefault();
      onMenuClick('snacks');
    }
  };

  return (
    <div className="container" id="menu">
      <div className="menu-content">
        <h2 className="section-title">Our Menu</h2>
        <p className="menu-subtitle">Explore our carefully curated selection of beverages and treats</p>
        <div className="menu-buttons">
          <Slider {...settings}>
            {menuItems.map((item, index) => (
              <div key={index}>
                <a 
                  href={item.href}
                  onClick={(e) => handleClick(e, item.href)}
                  style={{ backgroundImage: `url(${item.image})` }}
                >
                  <span>{item.title}</span>
                </a>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Menu;



