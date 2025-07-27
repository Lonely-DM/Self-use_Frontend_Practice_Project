import './Contact.css';

export default function Contact() {
  return (
    <div className="contact-page">
      <div className="contact-left">
        <h2>联系我们</h2>
        <p><strong>地址：</strong>莫里克 III · 星环太空城 L 区 3 层 14 号</p>
        <p><strong>营业时间：</strong>本地时间每日 08:00 - 20:00</p>
        <p><strong>通讯频道：</strong>#0414-88-COFFEE</p>
        <p><strong>星际信箱：</strong>contact@cozycoffee.fed</p>
      </div>

      <div className="contact-right">
        <h2>留言反馈</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="你的名字" required />
          <input type="email" placeholder="联络邮箱" required />
          <textarea placeholder="你想说的话..." rows="5" required></textarea>
          <button type="submit">发送信息</button>
        </form>
      </div>
    </div>
  );
}
