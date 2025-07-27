
import './Menu.css';

const menuItems = [
    //TO DO: Change item images to actual coffee images
  {
    name: '拿铁 Latte',
    description: '顺滑牛奶与浓郁浓缩的完美结合。',
    price: '¥28',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '美式 Americano',
    description: '清爽浓缩，醇香回甘，提神首选。',
    price: '¥24',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '摩卡 Mocha',
    description: '巧克力与咖啡的经典搭配，香甜浓郁。',
    price: '¥32',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '卡布奇诺 Cappuccino',
    description: '浓缩咖啡与奶泡的完美平衡，口感丰富。',
    price: '¥30',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '焦糖玛奇朵 Caramel Macchiato',
    description: '甜美焦糖与浓郁咖啡的绝妙融合。',
    price: '¥34',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '抹茶拿铁 Matcha Latte',
    description: '清新抹茶与丝滑牛奶的完美结合。',
    price: '¥28',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '冰咖啡 Iced Coffee',
    description: '清凉一夏，冰镇浓缩咖啡，提神又解渴。',
    price: '¥26',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '香草拿铁 Vanilla Latte',
    description: '香草风味的丝滑拿铁，甜美可口。',
    price: '¥30',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '热巧克力 Hot Chocolate',
    description: '浓郁热巧克力，温暖你的心。',
    price: '¥28',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '冰抹茶 Iced Matcha',
    description: '清新抹茶冰饮，夏日必备。',
    price: '¥30',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '柠檬水 Lemonade',
    description: '清爽柠檬水，解渴又提神。',
    price: '¥18',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
  {
    name: '水果茶 Fruit Tea',
    description: '新鲜水果与茶的完美结合，健康又美味。',
    price: '¥22',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=600&q=80',
  },
];


export default function Menu() {
  return (
    <div className="menu-page">

      <h2>本店精选菜单</h2>
      <div className="menu-grid">
        {menuItems.map((item, index) => (
          <div className="menu-card" key={index}>
            <img src={item.image} alt={item.name} />
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="price">{item.price}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
