import logo from '../assets/logo.svg';

function Navbar(){

    return (
    <>
        <div className="mt-2 h-20 sticky top-0 bg-dark-black rounded-2xl flex flex-row flex-nowrap p-2 justify-between">
            <div className="flex justify-center items-center flex-row ml-3">
                <img src={logo} className='w-10 mr-2'/>
                <h2>Formula 1 Data</h2>
            </div>
            <div className="flex items-center mr-3">
                <input type="text" placeholder="Search..." className="w-20 h-10 pl-2 pr-2 bg-dark-gray rounded-xl min-w-100"/>
            </div>
        </div>
    </>)
}
export default Navbar;