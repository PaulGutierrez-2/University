-- CreateTable
CREATE TABLE "_ProfessorsDegrees" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProfessorsDegrees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProfessorsDegrees_B_index" ON "_ProfessorsDegrees"("B");

-- AddForeignKey
ALTER TABLE "_ProfessorsDegrees" ADD CONSTRAINT "_ProfessorsDegrees_A_fkey" FOREIGN KEY ("A") REFERENCES "Degree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessorsDegrees" ADD CONSTRAINT "_ProfessorsDegrees_B_fkey" FOREIGN KEY ("B") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
