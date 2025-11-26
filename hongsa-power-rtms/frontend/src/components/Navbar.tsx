import { Link } from "react-router"
function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <h1 className="text-xl font-bold">Web Monitor Hongsa</h1>
      <ul className="flex space-x-4">
        <li><Link to="/" className="hover:underline">Home</Link></li>
        <li><Link to="/about" className="hover:underline">About</Link></li>
        <li><Link to="/contact" className="hover:underline">Contact</Link></li>
      </ul>
    </nav>
  )
}
export default Navbar