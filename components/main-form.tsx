"use client"

import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {Card, CardHeader} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {buttonVariants} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Loader2} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

export const possibleStates = z.enum(["PENDING", "PAID", "DELIVERED"])

export const dataSchema = z.object({
  students: z.array(z.object({
    name: z.string(),
    state: possibleStates,
    friends: z.array(z.object({
      name: z.string(),
      state: possibleStates,
    })),
  })),
  teachers: z.array(z.object({
    name: z.string(),
    state: possibleStates,
  })),
})

export type FormData = z.infer<typeof dataSchema>

export default function MainForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: {errors, isDirty},
  } = useForm<FormData>({
    resolver: zodResolver(dataSchema),
    defaultValues: {},
  })
  const {fields: studentFields, append: studentAppend, remove: studentRemove} = useFieldArray({
    control,
    name: 'students',
  });
  const {fields: teacherFields, append: teacherAppend, remove: teacherRemove} = useFieldArray({
    control,
    name: 'teachers',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    console.log(data)
    setIsLoading(false)
  }

  return (
    <form className="mx-1 grid" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="mb-1 mt-2 text-xl font-bold">
        Students
      </h2>
      <div className="grid gap-4">
        <div className="grid w-fit gap-2">
          {studentFields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="gap-2">
                <div>
                  <Label htmlFor={`name-${item.id}`}>
                    Name
                  </Label>
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
                  <Label htmlFor={`state-${item.id}`}>
                    State
                  </Label>
                  <Controller
                    control={control}
                    name={`students.${index}.state`}
                    render={({field: {value, onChange}}) => (
                      <Select disabled={isLoading} onValueChange={onChange}
                              defaultValue={value}>
                        <SelectTrigger id={`state-${item.id}`}>
                          <SelectValue placeholder="Select a state"/>
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
                <button className={cn("w-fit", buttonVariants())} type="button" onClick={() => studentRemove(index)}>
                  Remove
                </button>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="flex flex-row gap-2">
          <button className={cn("w-fit", buttonVariants())} type="button"
                  onClick={() => studentAppend({
                    name: "John Doe",
                    state: "PENDING",
                    friends: []
                  })}>
            Add
          </button>
          <button className={cn("w-fit", buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 size-4 animate-spin"/>
            )}
            Save
          </button>
        </div>
      </div>
      <h2 className="mb-1 mt-2 text-xl font-bold">
        Teachers
      </h2>
      <div className="grid gap-4">
      <div className="grid w-fit gap-2">
          {teacherFields.map((item, index) => (
            <Card key={item.id}>
              <CardHeader className="gap-2">
                <div>
                  <Label htmlFor={`teachers-name-${item.id}`}>
                    Name
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
                  <Label htmlFor={`teachers-state-${item.id}`}>
                    State
                  </Label>
                  <Controller
                    control={control}
                    name={`teachers.${index}.state`}
                    render={({field: {value, onChange}}) => (
                      <Select disabled={isLoading} onValueChange={onChange}
                              defaultValue={value}>
                        <SelectTrigger id={`teachers-state-${item.id}`}>
                          <SelectValue placeholder="Select a state"/>
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
                <button className={cn("w-fit", buttonVariants())} type="button" onClick={() => teacherRemove(index)}>
                  Remove
                </button>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="flex flex-row gap-2">
          <button className={cn("w-fit", buttonVariants())} type="button"
                  onClick={() => teacherAppend({
                    name: "John Doe",
                    state: "PENDING",
                  })}>
            Add
          </button>
          <button className={cn("w-fit", buttonVariants())} disabled={isLoading}>
            {isLoading && (
              <Loader2 className="mr-2 size-4 animate-spin"/>
            )}
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
