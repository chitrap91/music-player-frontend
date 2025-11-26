import { useFormik } from "formik";


function Search({ handleSearch }) {

    const formik = useFormik({

        initialValues: {
            search: ""
        },
        onSubmit: (values) => {
            handleSearch(values.search)
        }

    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="w-full flex justify-center mt-4 mb-4">
                <input
                    type="text"
                    name="search"
                    value={formik.values.search}
                    onChange={
                        formik.handleChange}


                    placeholder="Search by title, artist, album, or movie..."
                    className="w-full md:w-1/2 p-2 rounded-lg border border-gray-400 focus:outline-none text-gray-800 focus:border-blue-500"
                />
            </div>

        </form>


    )




}
export default Search