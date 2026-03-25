export default function ErrorDisplay({msg}: {msg: string}){

    return(
        <div className="w-100 bg-dark-gray rounded-2xl m-2 align-middle">
            <p className="text-red-500 text-center">{msg}</p>
        </div>
    )
}