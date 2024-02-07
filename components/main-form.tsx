"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const possibleStates = z.enum(["PENDING", "PAID", "DELIVERED"])

export const dataSchema = z.object({
  students: z.array(
    z.object({
      name: z.string(),
      state: possibleStates,
      friends: z.array(
        z.object({
          name: z.string(),
          state: possibleStates,
        })
      ),
    })
  ),
  teachers: z.array(
    z.object({
      name: z.string(),
      state: possibleStates,
    })
  ),
})

export type FormData = z.infer<typeof dataSchema>

export default function MainForm() {
  const [formDataDefaults, setFormDataDefaults] = useState<FormData | null>(
    null
  )

  useEffect(() => {
    if (window && window.localStorage) {
      const data = window.localStorage.getItem("formData")
      if (data) {
        setFormDataDefaults(JSON.parse(data))
      } else {
        setFormDataDefaults({
          students: [],
          teachers: [],
        })
      }
    }
  }, [])

  if (!formDataDefaults) {
    return null
  } else {
    return <MainFormData formDataDefaults={formDataDefaults} />
  }
}

function MainFormData({ formDataDefaults }: { formDataDefaults: FormData }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(dataSchema),
    defaultValues: formDataDefaults,
  })
  const {
    fields: studentFields,
    append: studentAppend,
    remove: studentRemove,
  } = useFieldArray({
    control,
    name: "students",
  })
  const {
    fields: teacherFields,
    append: teacherAppend,
    remove: teacherRemove,
  } = useFieldArray({
    control,
    name: "teachers",
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    console.log(data)
    const dataString = JSON.stringify(data)
    if (window && window.localStorage) {
      window.localStorage.setItem("formData", dataString)
    } else {
      console.error("localStorage not available")
    }
    toast.success("Saved")
    setIsLoading(false)
  }

  return (
    <form className="mx-1 grid" onSubmit={handleSubmit(onSubmit)}>
      <button className={cn("w-fit", buttonVariants())} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
        Save
      </button>

      <h2 className="mb-1 mt-2 text-xl font-bold">Students</h2>
      <div className="grid gap-4">
        <div className="grid w-fit gap-2">
          {studentFields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="gap-2">
                <div>
                  <Label htmlFor={`name-${item.id}`}>Student Name</Label>
                  <Input
                    id={`name-${item.id}`}
                    placeholder="Name"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="false"
                    type="text"
                    disabled={isLoading}
                    required
                    {...register(`students.${index}.name`)}
                  />
                  {errors?.students?.[index]?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.students[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`state-${item.id}`}>State</Label>
                  <Controller
                    control={control}
                    name={`students.${index}.state`}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        disabled={isLoading}
                        onValueChange={onChange}
                        defaultValue={value}
                      >
                        <SelectTrigger id={`state-${item.id}`}>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="PAID">PAID</SelectItem>
                          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors?.students?.[index]?.state && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.students[index]?.state?.message}
                    </p>
                  )}
                </div>
                <FriendsArray
                  control={control}
                  index={index}
                  register={register}
                />
                <button
                  className={cn("w-fit", buttonVariants())}
                  type="button"
                  onClick={() => studentRemove(index)}
                >
                  Remove
                </button>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="flex flex-row gap-2">
          <button
            className={cn("w-fit", buttonVariants())}
            type="button"
            onClick={() =>
              studentAppend({
                name: "John Doe",
                state: "PENDING",
                friends: [],
              })
            }
          >
            Add Student
          </button>
        </div>
      </div>
      <h2 className="mb-1 mt-2 text-xl font-bold">Teachers</h2>
      <div className="grid gap-4">
        <div className="grid w-fit gap-2">
          {teacherFields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="gap-2">
                <div>
                  <Label htmlFor={`teachers-name-${item.id}`}>
                    Teacher Name
                  </Label>
                  <Input
                    id={`teachers-name-${item.id}`}
                    placeholder="Name"
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="false"
                    type="text"
                    disabled={isLoading}
                    required
                    {...register(`teachers.${index}.name`)}
                  />
                  {errors?.teachers?.[index]?.name && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.teachers[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor={`teachers-state-${item.id}`}>State</Label>
                  <Controller
                    control={control}
                    name={`teachers.${index}.state`}
                    render={({ field: { value, onChange } }) => (
                      <Select
                        disabled={isLoading}
                        onValueChange={onChange}
                        defaultValue={value}
                      >
                        <SelectTrigger id={`teachers-state-${item.id}`}>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="PAID">PAID</SelectItem>
                          <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors?.teachers?.[index]?.state && (
                    <p className="px-1 text-xs text-red-600">
                      {errors.teachers[index]?.state?.message}
                    </p>
                  )}
                </div>
                <button
                  className={cn("w-fit", buttonVariants())}
                  type="button"
                  onClick={() => teacherRemove(index)}
                >
                  Remove
                </button>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="flex flex-row gap-2">
          <button
            className={cn("w-fit", buttonVariants())}
            type="button"
            onClick={() =>
              teacherAppend({
                name: "John Doe",
                state: "PENDING",
              })
            }
          >
            Add Teacher
          </button>
        </div>
      </div>
    </form>
  )
}

function FriendsArray({
  control,
  index,
  register,
}: {
  control: any
  index: number
  register: any
}) {
  const {
    fields: friendFields,
    append: friendAppend,
    remove: friendRemove,
  } = useFieldArray({
    control,
    name: `students.${index}.friends`,
  })

  return (
    <>
      <div className="grid">
        {friendFields.map((item, friendIndex) => (
          <Card key={item.id}>
            <CardHeader className="gap-2">
              <div>
                <Label htmlFor={`friend-name-${item.id}`}>Friend Name</Label>
                <Input
                  id={`friend-name-${item.id}`}
                  placeholder="Name"
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="false"
                  type="text"
                  required
                  {...register(`students.${index}.friends.${friendIndex}.name`)}
                />
              </div>
              <div>
                <Label htmlFor={`friend-state-${item.id}`}>State</Label>
                <Controller
                  control={control}
                  name={`students.${index}.friends.${friendIndex}.state`}
                  render={({ field: { value, onChange } }) => (
                    <Select onValueChange={onChange} defaultValue={value}>
                      <SelectTrigger id={`friend-state-${item.id}`}>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">PENDING</SelectItem>
                        <SelectItem value="PAID">PAID</SelectItem>
                        <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <button
                className={cn("w-fit", buttonVariants())}
                type="button"
                onClick={() => friendRemove(friendIndex)}
              >
                Remove
              </button>
            </CardHeader>
          </Card>
        ))}
      </div>
      <button
        className={cn("w-fit", buttonVariants())}
        type="button"
        onClick={() =>
          friendAppend({
            name: "John Doe",
            state: "PENDING",
          })
        }
      >
        Add Friend
      </button>
    </>
  )
}
