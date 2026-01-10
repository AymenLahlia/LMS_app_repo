import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../ui/form.jsx";
import {Button} from "../../ui/button.jsx";
import {Input} from "../../ui/input.jsx";
import {Loader} from "lucide-react";
import { axiosClient } from "../../../api/axios.js";

const formSchema = z.object({
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30)
})
export default function UserLogin() {

  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
        password: ""
    }
  })

  const isSubmitting = form.formState.isSubmitting;

  // 2. Define a submit handler.
  const onSubmit = async values => {
    const data = await axiosClient.post('/login', values)
     console.log(data);
     
  }

  return <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={'password'} placeholder="Password" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button className={'mt-2'} disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '} Login
        </Button>
      </form>
    </Form>
  </>
}