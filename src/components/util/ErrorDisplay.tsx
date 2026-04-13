export default function ErrorDisplay({msg}: {msg: string}){

    return(
        <div className="w-100% py-10 bg-dark-black rounded-2xl my-6 align-middle">
            <p className="text-red-500 text-center">{msg}</p>
        </div>
    )
}