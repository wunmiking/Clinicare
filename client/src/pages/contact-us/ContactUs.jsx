
export default function ContactUs() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto container min-h-[80vh]">
        <div>
            <img className="h-[90%] w-full" src="Contact-us.svg" alt="contact-us image" />
        </div>
        <div className="flex flex-col items-center ">
            <h1 className="font-bold text-3xl pt-5">Contact Us</h1>
            <a href="mailto:clinicare@gmail.com" className="py-2 hover:text-blue-500 cursor-pointer"> 
                Email: clinicare@gmail.com
            </a>
            <a href="tel:+234-1234567891" className="py-2 hover:text-blue-500 cursor-pointer"> Phone: +234 123 456 789</a>
        </div>
    </div>
  );
}
 